// src/api/profile/ProfileApi.jsx
import ApiClient from "../core/ApiClient";
import { API_URL } from "@env";

const BASE_URL = `${API_URL}/api/profiles`;
const apiClient = new ApiClient(BASE_URL);

export async function getMyProfile(accessToken) {
	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};
	return await apiClient.get("/me/", headers);
}

export async function updateMyProfile(accessToken, profileData) {
	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};
	return await apiClient.put("/me/", profileData, headers);
}

export async function getPublicProfile(accessToken, userId) {
	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};
	return await apiClient.get(`/${userId}/`, headers);
}
