import { useState, useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import MessageHeader from "../../components/chat/MessageHeader";
import MessagesList from "../../components/chat/MessagesList";
import MessageInput from "../../components/chat/MessageInput";
import { useKeyboard } from "../../hooks/useKeyboard";

export default function MessageDetailScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const { username, profileImage } = route.params || {};
	const [message, setMessage] = useState("");
	const keyboardHeight = useKeyboard();
	const [messages, setMessages] = useState([
		{
			id: 1,
			text: "Hello! How are you?",
			isSent: false,
			timestamp: "10:30 AM",
		},
		{
			id: 2,
			text: "I'm doing great, thanks for asking!",
			isSent: true,
			timestamp: "10:32 AM",
		},
		{
			id: 3,
			text: "That's awesome to hear!",
			isSent: false,
			timestamp: "10:33 AM",
		},
	]);

	const handleSend = () => {
		if (message.trim()) {
			const newMessage = {
				id: messages.length + 1,
				text: message.trim(),
				isSent: true,
				timestamp: new Date().toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				}),
			};
			setMessages([...messages, newMessage]);
			setMessage("");
		}
	};

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
				/>
				<MessagesList messages={messages} keyboardHeight={keyboardHeight} />
				<MessageInput
					message={message}
					onMessageChange={setMessage}
					onSend={handleSend}
					keyboardHeight={keyboardHeight}
				/>
			</View>
		</SafeAreaView>
	);
}
