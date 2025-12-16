import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatSearchBar from "../../components/chat/ChatSearchBar";
import MessageList from "../../components/chat/MessageList";
import profile from "../../assets/profile.jpg";

export default function ChatScreen() {
	const navigation = useNavigation();

	// Mock data - replace with actual API data
	const messages = [
		{
			id: 1,
			username: "Hiyori",
			profileImage: profile,
			lastMessage: "How are you?",
			hasUnread: true,
		},
		{
			id: 2,
			username: "Alice",
			profileImage: profile,
			lastMessage: "See you tomorrow!",
			hasUnread: true,
		},
		{
			id: 3,
			username: "Bob",
			profileImage: profile,
			lastMessage: "Thanks for your help",
			hasUnread: false,
		},
	];

	const handleFilterPress = () => {
		console.log("Filter pressed");
	};

	const handleMessagePress = (message) => {
		navigation.navigate("MessageDetail", {
			username: message.username,
			profileImage: message.profileImage,
		});
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			className="flex-1 bg-dark"
		>
			<ChatSearchBar onFilterPress={handleFilterPress} />
			<MessageList
				messages={messages}
				onMessagePress={handleMessagePress}
			/>
		</ScrollView>
	);
}
