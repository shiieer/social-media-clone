// hooks/useChatRooms.jsx
import { useState, useCallback, useEffect } from "react";
import { ChatApi } from "../api/chat/ChatApi";
import { transformRoom } from "../utils/chatHelpers";

/**
 * Custom hook to manage chat rooms
 * @param {string} accessToken - User access token
 * @returns {Object} { chatRooms, loading, error, fetchChatRooms, refreshing, onRefresh }
 */
export function useChatRooms(accessToken) {
	const [chatRooms, setChatRooms] = useState([]);
	const [loading, setLoading] = useState(false); // Start with false, will be set to true when fetching
	const [error, setError] = useState(null);
	const [refreshing, setRefreshing] = useState(false);

	const fetchChatRooms = useCallback(async (showLoading = true) => {
		if (!accessToken) {
			if (showLoading) {
				setLoading(false);
			}
			return;
		}

		try {
			if (showLoading) {
				setLoading(true);
			}
			setError(null);
			const result = await ChatApi.getChatRooms(accessToken);

			if (result.success) {
				const transformedRooms = result.data.map(transformRoom);
				setChatRooms(transformedRooms);
			} else {
				setError(result.error || "Failed to load chat rooms");
			}
		} catch (err) {
			console.error("Error fetching chat rooms:", err);
			setError("Failed to load chat rooms");
		} finally {
			// Always set loading to false in finally block
			if (showLoading) {
				setLoading(false);
			}
		}
	}, [accessToken]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchChatRooms(false);
		setRefreshing(false);
	}, [fetchChatRooms]);

	return {
		chatRooms,
		loading,
		error,
		fetchChatRooms,
		refreshing,
		onRefresh,
	};
}

