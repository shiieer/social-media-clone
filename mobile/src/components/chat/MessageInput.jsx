import { View, TextInput, TouchableOpacity, Text } from "react-native";

export default function MessageInput({
	message,
	onMessageChange,
	onSend,
	keyboardHeight,
}) {
	return (
		<View
			className="flex-row items-center px-4 pt-2 border-t border-gray-800 bg-dark"
			style={{
				paddingBottom: keyboardHeight > 0 ? keyboardHeight + 8 : 16,
			}}
		>
			<View className="flex-row items-center px-4 flex-1 rounded-full bg-quaternary">
				<TextInput
					className="text-white flex-1 py-3"
					placeholder="Type a message..."
					placeholderTextColor="#999"
					value={message}
					onChangeText={onMessageChange}
					multiline
					maxLength={500}
					style={{ maxHeight: 100 }}
				/>
			</View>
			<TouchableOpacity
				onPress={onSend}
				disabled={!message.trim()}
				className={`ml-3 px-6 py-3 rounded-full ${
					message.trim() ? "bg-primary" : "bg-gray-700"
				}`}
			>
				<Text
					className={`font-semibold ${
						message.trim() ? "text-white" : "text-gray-400"
					}`}
				>
					Send
				</Text>
			</TouchableOpacity>
		</View>
	);
}

