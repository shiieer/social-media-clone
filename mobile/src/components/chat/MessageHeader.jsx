import { View, Text, TouchableOpacity, Image } from "react-native";
import { ArrowLeft } from "../Icons";
import defaultProfileImage from "../../assets/profile.jpg";

export default function MessageHeader({ username, profileImage, onBackPress }) {
	return (
		<View className="flex-row items-center justify-between px-4 pt-4 pb-2 border-b border-gray-800">
			<TouchableOpacity onPress={onBackPress} className="p-2">
				<ArrowLeft />
			</TouchableOpacity>
			<View className="flex-row items-center gap-3 flex-1">
				<Image
					source={profileImage || defaultProfileImage}
					className="rounded-full"
					style={{ width: 40, height: 40 }}
				/>
				<Text className="text-white font-semibold text-lg">
					{username || "User"}
				</Text>
			</View>
			<View className="w-10" />
		</View>
	);
}

