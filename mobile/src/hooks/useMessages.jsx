// hooks/useMessages.jsx
import { useState, useRef, useCallback } from "react";
import { ChatApi } from "../api/chat/ChatApi";

/**
 * Custom hook to manage messages in chat room
 * @param {string} accessToken - User access token
 * @param {number} userId - Current user ID
 * @returns {Object} { messages, loading, error, fetchMessages, sendMessage, sending, unreadCount, markAsRead, setUnreadCount }
 */
export function useMessages(accessToken, userId) {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [sending, setSending] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const lastMarkedReadRef = useRef(null);
	const messagesRef = useRef([]);

	// Keep messagesRef in sync with messages state
	const updateMessagesRef = useCallback((updater) => {
		if (typeof updater === 'function') {
			setMessages(prev => {
				const newMessages = updater(prev);
				messagesRef.current = newMessages;
				return newMessages;
			});
		} else {
			messagesRef.current = Array.isArray(updater) ? updater : [];
			setMessages(updater);
		}
	}, []);

	const transformMessage = useCallback((msg) => {
		const isSent = msg.sender.id === userId;
		const date = new Date(msg.created_at);

		return {
			id: msg.id,
			text: msg.content || "",
			isSent: isSent,
			isRead: msg.is_read !== undefined ? msg.is_read : true,
			timestamp: date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			}),
		};
	}, [userId]);

	const markAsRead = useCallback(async (roomId, apiMessages) => {
		if (!roomId || !accessToken || !apiMessages || apiMessages.length === 0) return;

		const unreadReceivedMessages = apiMessages.filter(
			msg => msg.sender.id !== userId && (msg.is_read === false || msg.is_read === undefined)
		);

		if (unreadReceivedMessages.length === 0) return;

		const messageIds = unreadReceivedMessages.map(msg => msg.id);
		const messageIdsStr = messageIds.sort().join(',');

		if (lastMarkedReadRef.current === messageIdsStr) return;

		try {
			const result = await ChatApi.markMessagesAsRead(
				accessToken,
				roomId,
				messageIds
			);

			if (result.success) {
				lastMarkedReadRef.current = messageIdsStr;
				updateMessagesRef(prev => prev.map(msg => {
					if (messageIds.includes(msg.id)) {
						return { ...msg, isRead: true };
					}
					return msg;
				}));
				setUnreadCount(prev => Math.max(0, prev - messageIds.length));
			}
		} catch (err) {
			console.error("Error marking messages as read:", err);
		}
	}, [accessToken, userId, updateMessagesRef]);

	const fetchMessages = useCallback(async (roomId, showLoading = true, onlyNew = false) => {
		if (!roomId || !accessToken) return;

		try {
			if (showLoading) {
				setLoading(true);
			}
			setError(null);

			// Get last message ID from ref (current state)
			const lastMessageId = onlyNew && messagesRef.current.length > 0
				? messagesRef.current[messagesRef.current.length - 1].id
				: null;

			const result = await ChatApi.getRoomMessages(
				accessToken,
				roomId,
				lastMessageId
			);

			if (result.success) {
				const transformedMessages = result.data.map(transformMessage);

				if (onlyNew && lastMessageId && transformedMessages.length > 0) {
					updateMessagesRef(prev => {
						const existingIds = new Set(prev.map(m => m.id));
						const newMessages = transformedMessages.filter(msg => !existingIds.has(msg.id));
						return newMessages.length > 0 ? [...prev, ...newMessages] : prev;
					});
				} else {
					// Remove duplicates
					const uniqueMessages = transformedMessages.reduce((acc, msg) => {
						if (!acc.find(m => m.id === msg.id)) {
							acc.push(msg);
						}
						return acc;
					}, []);
					updateMessagesRef(uniqueMessages);
				}

				// Auto-mark received messages as read
				markAsRead(roomId, result.data);
			} else {
				setError(result.error || "Failed to load messages");
			}
		} catch (err) {
			console.error("Error fetching messages:", err);
			setError("Failed to load messages");
		} finally {
			if (showLoading) {
				setLoading(false);
			}
		}
	}, [accessToken, transformMessage, markAsRead, updateMessagesRef]);

	const sendMessage = useCallback(async (roomId, content) => {
		if (!content.trim() || sending || !accessToken) return null;

		try {
			setSending(true);
			const result = await ChatApi.sendMessage(
				accessToken,
				roomId,
				content.trim()
			);

			if (result.success) {
				const newMsg = result.data;
				const transformedMessage = transformMessage(newMsg);

				updateMessagesRef(prev => {
					const exists = prev.some(m => m.id === transformedMessage.id);
					if (exists) {
						return prev;
					}
					return [...prev, transformedMessage];
				});

				return transformedMessage;
			}
			return null;
		} catch (err) {
			console.error("Error sending message:", err);
			return null;
		} finally {
			setSending(false);
		}
	}, [accessToken, sending, transformMessage, updateMessagesRef]);

	return {
		messages,
		loading,
		error,
		sending,
		unreadCount,
		fetchMessages,
		sendMessage,
		markAsRead,
		setUnreadCount,
	};
}
