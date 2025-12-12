import { View, Text, TouchableOpacity } from "react-native";
import { CreatePost, UserSetting } from "../components/Icons";

export default function Header({ username }) {
	if (!username) return null;

	return (
		<View className="flex justify-between px-4 py-3">
			<TouchableOpacity>
				<CreatePost />
			</TouchableOpacity>
			<Text className="text-white font-semibold text-lg">
				@{username}
			</Text>
			<TouchableOpacity>
				<UserSetting />
			</TouchableOpacity>
		</View>
	);
}
