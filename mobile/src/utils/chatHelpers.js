// utils/chatHelpers.js

/**
 * Transform room data from API to format used in UI
 */
export const transformRoom = (room) => {
	const otherParticipant = room.other_participant;
	const lastMessage = room.last_message;
	const unreadCount = room.unread_count || 0;

	return {
		id: room.id,
		roomId: room.id,
		username: otherParticipant?.username || "Unknown",
		profileImage: otherParticipant?.profile_img
			? { uri: otherParticipant.profile_img }
			: null,
		lastMessage: lastMessage?.content || "No messages yet",
		hasUnread: unreadCount > 0,
		unreadCount: unreadCount,
		otherParticipantId: otherParticipant?.id,
	};
};

/**
 * Transform message data from API to format used in UI
 */
export const transformMessage = (msg, userId) => {
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
};

/**
 * Get profile image source from user data
 */
export const getProfileImageSource = (user) => {
	if (user?.profile_img) {
		return { uri: user.profile_img };
	}
	return null;
};

/**
 * Get navigation params for MessageDetailScreen
 */
export const getMessageDetailParams = (room, selectedUser = null) => {
	const otherParticipant = room.other_participant || selectedUser;

	return {
		roomId: room.id,
		username: otherParticipant?.username || "Unknown",
		profileImage: getProfileImageSource(otherParticipant),
		otherParticipantId: otherParticipant?.id,
	};
};

