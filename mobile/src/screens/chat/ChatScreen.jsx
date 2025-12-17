import { useEffect, useCallback, useContext } from "react";
import { ScrollView, ActivityIndicator, View, Text, RefreshControl } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ChatSearchBar from "../../components/chat/ChatSearchBar";
import MessageList from "../../components/chat/MessageList";
import { AuthContext } from "../../auth/AuthContext";
import { useChatRooms } from "../../hooks/useChatRooms";
import { usePolling } from "../../hooks/usePolling";

export default function ChatScreen() {
	const navigation = useNavigation();
	const authContext = useContext(AuthContext);
	const user = authContext?.user || null;

	const {
		chatRooms,
		loading,
		error,
		fetchChatRooms,
		refreshing,
		onRefresh,
	} = useChatRooms(user?.accessToken);

	// Setup polling for auto-refresh chat rooms
	const { startPolling, stopPolling } = usePolling(
		() => fetchChatRooms(false),
		2000
	);

	useEffect(() => {
		if (user?.accessToken) {
			fetchChatRooms();
			startPolling();
		}

		return () => {
			stopPolling();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.accessToken]);

	// Refresh chat rooms when screen is focused
	useFocusEffect(
		useCallback(() => {
			if (user?.accessToken) {
				fetchChatRooms(false);
				startPolling();
			}
			return () => {
				stopPolling();
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [user?.accessToken])
	);

	const handleFilterPress = () => {
		console.log("Filter pressed");
	};

	const handleMessagePress = (message) => {
		navigation.navigate("MessageDetail", {
			roomId: message.roomId,
			username: message.username,
			profileImage: message.profileImage,
			otherParticipantId: message.otherParticipantId,
		});
	};

	if (loading) {
		return (
			<View className="flex-1 bg-dark justify-center items-center">
				<ActivityIndicator size="large" color="#fff" />
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 bg-dark justify-center items-center p-6">
				<Text className="text-white text-center mb-4">{error}</Text>
				<Text 
					className="text-primary underline"
					onPress={fetchChatRooms}
				>
					Tap to retry
				</Text>
			</View>
		);
	}

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			className="flex-1 bg-dark"
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					tintColor="#fff"
				/>
			}
		>
			<ChatSearchBar onFilterPress={handleFilterPress} />
			<MessageList
				messages={chatRooms}
				onMessagePress={handleMessagePress}
			/>
		</ScrollView>
	);
}
