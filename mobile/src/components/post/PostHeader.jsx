import { View, Image, Text } from "react-native";

export default function PostHeader({ profileImage, username, size = 24 }) {
	return (
		<View className="flex-row items-center p-4 gap-2">
			<Image
				className="rounded-full"
				source={profileImage}
				style={{ height: size, width: size }}
				resizeMode="cover"
			/>
			<Text className="text-white font-bold">{username}</Text>
		</View>
	);
}

