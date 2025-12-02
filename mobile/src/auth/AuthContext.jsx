// src/auth/AuthContext.js
import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { tokenStorage } from "./TokenStorage";
import { login, getProfile } from "../api/AuthApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		initializeAuth();
	}, []);

	const initializeAuth = async () => {
		try {
			// Use the class instance methods
			const accessToken = await tokenStorage.getAccessToken();
			if (accessToken) {
				const userProfile = await loadUserProfile(accessToken);
				setUser(userProfile);
			}
		} catch (error) {
			console.error("Auth initialization error:", error);
			// Use the class instance method
			await tokenStorage.clearTokens();
		} finally {
			setInitializing(false);
		}
	};

	const loadUserProfile = async (accessToken) => {
		try {
			const result = await getProfile(accessToken);
			if (result.success) {
				return { ...result.data, accessToken };
			}
			throw new Error("Failed to load user profile");
		} catch (error) {
			console.error("Profile load error:", error);
			throw error;
		}
	};

	const loginUser = useCallback(async (credentials) => {
		try {
			setLoading(true);
			console.log("Calling login API...");

			const result = await login(credentials);
			console.log("Login API result:", result);

			if (result.success) {
				const { access, refresh, user: userData } = result.data;

				await tokenStorage.saveTokens(access, refresh);

				const userWithToken = { ...userData, accessToken: access };
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
