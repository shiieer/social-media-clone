// src/api/chat/ChatApi.jsx
import ApiClient from "../core/ApiClient";
import { API_URL } from "@env";

const BASE_URL = `${API_URL}/api`;
const apiClient = new ApiClient(BASE_URL);

export const ChatApi = {
	async getChatRooms(accessToken) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		return await apiClient.get("/chat/rooms/", headers);
	},

	async getOrCreateRoom(accessToken, userId) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		return await apiClient.post("/chat/room/get-or-create/", { user_id: userId }, headers);
	},

	async getRoomMessages(accessToken, roomId, afterMessageId = null) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		let endpoint = `/chat/room/${roomId}/messages/`;
		if (afterMessageId) {
			endpoint += `?after=${afterMessageId}`;
		}
		return await apiClient.get(endpoint, headers);
	},

	async sendMessage(accessToken, roomId, content, imgUrl = null) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		const body = {};
		if (content) body.content = content;
		if (imgUrl) body.img_url = imgUrl;
		return await apiClient.post(`/chat/room/${roomId}/message/`, body, headers);
	},

	async getSuggestedUsers(accessToken) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		return await apiClient.get("/chat/suggested-users/", headers);
	},

	async markMessagesAsRead(accessToken, roomId, messageIds = null) {
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		const body = messageIds ? { message_ids: messageIds } : {};
		return await apiClient.post(`/chat/room/${roomId}/mark-read/`, body, headers);
	},
};

export default ChatApi;

