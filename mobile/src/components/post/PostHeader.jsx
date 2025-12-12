import { View, Image, Text, TouchableOpacity } from "react-native";
import { PostMenu } from "../Icons";

export default function PostHeader({ profileImage, username, size = 24 }) {
	return (
		<View className="flex-row items-center justify-between p-4 ">
			<View className="flex-row items-center gap-2">
				<Image
					className="rounded-full"
					source={profileImage}
					style={{ height: size, width: size }}
					resizeMode="cover"
				/>
				<Text className="text-white font-bold">{username}</Text>
			</View>
			<TouchableOpacity>
				<PostMenu />
			</TouchableOpacity>
		</View>
	);
}
