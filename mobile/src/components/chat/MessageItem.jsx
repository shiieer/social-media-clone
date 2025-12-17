import { View, Text, TouchableOpacity } from "react-native";
import ProfileImage from "../ProfileImage";

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
				<ProfileImage
					source={profileImage}
					size={56}
				/>
				<View>
					<Text className="text-white font-semibold">
						{username}
					</Text>
					<Text 
						className={hasUnread ? "text-white font-medium" : "text-messagetext"} 
						numberOfLines={1}
					>
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

