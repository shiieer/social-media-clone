// src/api/posts/PostsApi.jsx
import ApiClient from "../core/ApiClient";
import { API_URL } from "@env";

const BASE_URL = `${API_URL}/api`;
const apiClient = new ApiClient(BASE_URL);

export const PostsApi = {
	async getAllPosts(accessToken) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		return await apiClient.get("/posts/", headers);
	},

	async createPost(accessToken, postData) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		return await apiClient.post("/posts/", postData, headers);
	},

	async likePost(accessToken, postId) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		return await apiClient.post(`/posts/${postId}/like/`, {}, headers);
	},
};

export default PostsApi;

