// src/api/auth/AuthApi.jsx
import ApiClient from "../core/ApiClient";
import { API_URL } from "@env";

const BASE_URL = `${API_URL}/api/accounts`;
const apiClient = new ApiClient(BASE_URL);

export async function login(credentials) {
	const headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};

	return await apiClient.post("/login/", credentials, headers);
}

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
	return await apiClient.post(
		"/token/refresh/",
		{ refresh: refreshTokenValue },
		headers
	);
}
