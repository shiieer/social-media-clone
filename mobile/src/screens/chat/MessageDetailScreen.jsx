import { useState, useEffect, useCallback, useContext } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import MessageHeader from "../../components/chat/MessageHeader";
import MessagesList from "../../components/chat/MessagesList";
import MessageInput from "../../components/chat/MessageInput";
import { useKeyboard } from "../../hooks/useKeyboard";
import { AuthContext } from "../../auth/AuthContext";
import { useMessages } from "../../hooks/useMessages";
import { usePolling } from "../../hooks/usePolling";
import { ChatApi } from "../../api/chat/ChatApi";

export default function MessageDetailScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const { roomId, username, profileImage, otherParticipantId } = route.params || {};
	const authContext = useContext(AuthContext);
	const user = authContext?.user || null;
	const [message, setMessage] = useState("");
	const keyboardHeight = useKeyboard();
	const [currentRoomId, setCurrentRoomId] = useState(roomId);

	const {
		messages,
		loading,
		error,
		sending,
		unreadCount,
		fetchMessages,
		sendMessage: sendMessageHook,
		setUnreadCount,
	} = useMessages(user?.accessToken, user?.id);

	// Setup polling for auto-refresh messages
	const { startPolling, stopPolling } = usePolling(
		() => {
			if (currentRoomId) {
				return fetchMessages(currentRoomId, false, true);
			}
		},
		1500
	);

	useEffect(() => {
		if (currentRoomId && user?.accessToken) {
			fetchMessages(currentRoomId);
			startPolling();
		} else if (otherParticipantId && user?.accessToken && !currentRoomId) {
			createOrGetRoom();
		}

		return () => {
			stopPolling();
		};
	}, [currentRoomId, otherParticipantId, user?.accessToken]);

	// Refresh messages when screen is focused
	useFocusEffect(
		useCallback(() => {
			if (currentRoomId && user?.accessToken) {
				fetchMessages(currentRoomId, false);
				startPolling();
				setUnreadCount(0);
			}
			return () => {
				stopPolling();
			};
		}, [currentRoomId, user?.accessToken, fetchMessages, startPolling, stopPolling, setUnreadCount])
	);

	const createOrGetRoom = async () => {
		if (!otherParticipantId || !user?.accessToken) return;

		try {
			const result = await ChatApi.getOrCreateRoom(user.accessToken, otherParticipantId);
			if (result.success) {
				const newRoomId = result.data.id;
				route.params.roomId = newRoomId;
				setCurrentRoomId(newRoomId);
				await fetchMessages(newRoomId);
				startPolling();
			}
		} catch (err) {
			console.error("Error creating/getting room:", err);
		}
	};

	const handleSend = async () => {
		if (!message.trim() || sending || !currentRoomId) return;

		const sentMessage = await sendMessageHook(currentRoomId, message.trim());
		
		if (sentMessage) {
			setMessage("");
			// Refresh messages after a short delay to get any new messages from other user
			setTimeout(() => {
				fetchMessages(currentRoomId, false, true);
			}, 500);
		}
	};

	if (loading && messages.length === 0) {
		return (
			<SafeAreaView
				style={{ flex: 1 }}
				edges={["top", "left", "right", "bottom"]}
				className="bg-dark"
			>
				<View style={{ flex: 1 }} className="justify-center items-center">
					<ActivityIndicator size="large" color="#fff" />
				</View>
			</SafeAreaView>
		);
	}

	if (error && messages.length === 0) {
		return (
			<SafeAreaView
				style={{ flex: 1 }}
				edges={["top", "left", "right", "bottom"]}
				className="bg-dark"
			>
				<View style={{ flex: 1 }} className="justify-center items-center p-6">
					<Text className="text-white text-center mb-4">{error}</Text>
					<Text 
						className="text-primary underline"
						onPress={() => {
							if (currentRoomId) {
								fetchMessages(currentRoomId);
							} else if (otherParticipantId) {
								createOrGetRoom();
							}
						}}
					>
						Tap to retry
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView
			style={{ flex: 1 }}
			edges={["top", "left", "right", "bottom"]}
			className="bg-dark"
		>
			<View style={{ flex: 1 }}>
				<MessageHeader
					username={username}
					profileImage={profileImage}
					onBackPress={() => navigation.goBack()}
					unreadCount={unreadCount}
				/>
				<View style={{ flex: 1 }}>
					<MessagesList messages={messages} keyboardHeight={keyboardHeight} />
				</View>
				<MessageInput
					message={message}
					onMessageChange={setMessage}
					onSend={handleSend}
					keyboardHeight={keyboardHeight}
					disabled={sending}
				/>
			</View>
		</SafeAreaView>
	);
}
