// src/auth/AuthContext.js
import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { tokenStorage } from "./TokenStorage";
import { login, getProfile, refreshToken } from "../api/auth/AuthApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		initializeAuth();
	}, []);

	// Restore user from storage if state was lost during hot reload
	useEffect(() => {
		if (!user && !initializing) {
			restoreUserFromStorage();
		}
	}, [user, initializing]);

	const restoreUserFromStorage = async () => {
		try {
			const accessToken = await tokenStorage.getAccessToken();
			if (accessToken) {
				const profileResult = await loadUserProfile(accessToken);
				if (profileResult) {
					setUser(profileResult);
				}
			}
		} catch (error) {
			// Silently fail - don't clear tokens on restore errors
			console.log("Restore user from storage failed, but keeping tokens");
		}
	};

	const initializeAuth = async () => {
		try {
			const accessToken = await tokenStorage.getAccessToken();
			const refreshTokenValue = await tokenStorage.getRefreshToken();

			if (accessToken && refreshTokenValue) {
				// Try to load profile with existing access token
				const profileResult = await loadUserProfile(accessToken);
				
				if (profileResult) {
					setUser(profileResult);
				} else {
					// If access token is invalid, try to refresh it
					console.log("Access token invalid, attempting refresh...");
					const refreshResult = await attemptTokenRefresh(refreshTokenValue);
					if (refreshResult) {
						setUser(refreshResult);
					} else {
						// Don't clear tokens on refresh failure - might be network issue
						// Tokens will be cleared only on explicit auth errors
						console.log("Token refresh failed, preserving tokens");
					}
				}
			}
		} catch (error) {
			console.error("Auth initialization error:", error);
			// Only clear tokens on actual authentication errors (401/403)
			// Never clear tokens on network errors or during hot reload
			if (error.status === 401 || error.status === 403) {
				console.log("Authentication error, clearing tokens");
				await tokenStorage.clearTokens();
				setUser(null);
			} else {
				// For network errors, 500s, etc. - preserve tokens
				console.log("Non-auth error during init, preserving tokens");
			}
		} finally {
			setInitializing(false);
		}
	};

	const attemptTokenRefresh = async (refreshTokenValue) => {
		try {
			const result = await refreshToken(refreshTokenValue);
			if (result.success && result.data.access) {
				const newAccessToken = result.data.access;
				// Save the new access token (keep existing refresh token)
				await tokenStorage.setItem(tokenStorage.keys.ACCESS, newAccessToken);
				// Load user profile with new token
				const userProfile = await loadUserProfile(newAccessToken);
				if (userProfile) {
					return userProfile;
				}
			}
			return null;
		} catch (error) {
			console.error("Token refresh error:", error);
			// If refresh endpoint doesn't exist (404) or refresh token is invalid, return null
			if (error.status === 404) {
				console.log("Refresh endpoint not available, skipping token refresh");
			}
			return null;
		}
	};

	const loadUserProfile = async (accessToken) => {
		try {
			const result = await getProfile(accessToken);
			if (result.success) {
				return { ...result.data, accessToken };
			}
			// If profile load fails with 401/403, return null to trigger refresh
			if (result.status === 401 || result.status === 403) {
				console.log("Profile load failed with auth error:", result.status);
				return null;
			}
			// For other errors (network, 500, etc.), don't clear tokens
			// Just return null to allow refresh attempt, but don't throw
			console.log("Profile load failed with non-auth error:", result.status);
			return null;
		} catch (error) {
			console.error("Profile load error:", error);
			// Return null for auth errors to allow refresh attempt
			if (error.status === 401 || error.status === 403) {
				return null;
			}
			// For network errors or other issues, return null but don't throw
			// This prevents clearing tokens during hot reload when backend might be unavailable
			console.log("Network or other error during profile load, preserving state");
			return null;
		}
	};

	const loginUser = useCallback(async (credentials) => {
		try {
			setLoading(true);
			console.log("Calling login API...");

			const result = await login(credentials);
			console.log("Login API result:", result);

		if (result.success) {
			// Handle nested response structure: result.data.data or result.data
			const responseData = result.data?.data || result.data;
			const { access, refresh, user: userData } = responseData;

			// Ensure tokens are strings before saving
			if (!access || !refresh) {
				console.error("Missing tokens in response:", responseData);
				return {
					success: false,
					error: "Invalid response: missing access or refresh token",
				};
			}

			const accessToken = String(access);
			const refreshToken = String(refresh);

			await tokenStorage.saveTokens(accessToken, refreshToken);

			const userWithToken = { ...userData, accessToken: accessToken };
			setUser(userWithToken);

			console.log("Login successful, returning result");
			return { success: true, data: userWithToken };
		} else {
				console.log("Login failed, returning error");
				const errorMessage =
					(typeof result.error === "string" && result.error.length > 0
						? result.error
						: result?.data?.detail) || "Username or password invalid";

				return {
					success: false,
					error: errorMessage,
					data: result.data,
					status: result.status,
				};
			}
		} catch (error) {
			console.error("Login context error:", error);
			return {
				success: false,
				error: "Login failed: " + error.message,
			};
		} finally {
			setLoading(false);
		}
	}, []);

	const logOutUser = useCallback(async () => {
		try {
			setLoading(true);
			// Use the class instance method
			await tokenStorage.clearTokens();
			setUser(null);
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const updateUser = useCallback((updates) => {
		setUser((prev) => (prev ? { ...prev, ...updates } : null));
	}, []);

	const isAuthenticated = useCallback(() => {
		return !!user?.accessToken;
	}, [user]);

	const contextValue = useMemo(
		() => ({
			user,
			loading,
			initializing,
			loginUser,
			logOutUser,
			updateUser,
			isAuthenticated,
		}),
		[user, loading, initializing, loginUser, logOutUser, updateUser, isAuthenticated]
	);

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}
