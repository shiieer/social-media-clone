// src/api/auth/AuthApi.jsx
import ApiClient from "../core/ApiClient";
import { API_URL } from "@env";

// Point to Django accounts API namespace
// Example: http://localhost:8000/api/accounts
const BASE_URL = `${API_URL}/api/accounts`;
const apiClient = new ApiClient(BASE_URL);

// Choose ONE of these approaches:

// APPROACH 1: Using JSON with explicit headers (Recommended)
export async function login(credentials) {
	const headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};

	return await apiClient.post("/login/", credentials, headers);
}

// APPROACH 2: Using FormData (Alternative)
// export async function login(credentials) {
//   // Try using FormData instead of JSON
//   const formData = new FormData();
//   formData.append('username', credentials.username);
//   formData.append('password', credentials.password);
//
//   return await apiClient.post("/login/", formData);
// }

export async function register(userData) {
	const headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};
	return await apiClient.post("/register/", userData, headers);
}

export async function getProfile(accessToken) {
	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};
	return await apiClient.get("/me/", headers);
}

export async function refreshToken(refreshTokenValue) {
	const headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};
	return await apiClient.post("/token/refresh/", { refresh: refreshTokenValue }, headers);
}

