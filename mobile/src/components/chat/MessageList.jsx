import { View, Text } from "react-native";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, onMessagePress }) {
	return (
		<View className="flex p-6 gap-4">
			<View>
				<Text className="text-white text-lg font-bold tracking-wider">
					Messages
				</Text>
			</View>
			<View className="flex gap-3">
				{messages.map((message, index) => (
					<MessageItem
						key={index}
						profileImage={message.profileImage}
						username={message.username}
						lastMessage={message.lastMessage}
						hasUnread={message.hasUnread}
						onPress={() => onMessagePress(message)}
					/>
				))}
			</View>
		</View>
	);
}

