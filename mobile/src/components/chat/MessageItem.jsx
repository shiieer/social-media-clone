import { View, Text, Image, TouchableOpacity } from "react-native";

export default function MessageItem({
	profileImage,
	username,
	lastMessage,
	hasUnread,
	onPress,
}) {
	return (
		<TouchableOpacity
			className="flex-row items-center justify-between"
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View className="flex-row items-center gap-4">
				<Image
					source={profileImage}
					className="rounded-full"
					style={{ width: 56, height: 56 }}
				/>
				<View>
					<Text className="text-white font-semibold">
						{username}
					</Text>
					<Text className="text-messagetext" numberOfLines={1}>
						{lastMessage}
					</Text>
				</View>
			</View>
			{hasUnread && (
				<View className="bg-primary rounded-full p-1"></View>
			)}
		</TouchableOpacity>
	);
}

