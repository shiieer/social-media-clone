import { View, Text, TouchableOpacity } from "react-native";
import { CreatePost, UserSetting, SearchIcon } from "../components/Icons";

export default function Header({ type = "home", username }) {
	// Home Header - with username, create post, and settings
	if (type === "home") {
		return (
			<View className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
				<TouchableOpacity>
					<CreatePost />
				</TouchableOpacity>
				<Text className="text-white font-semibold text-2xl">
					{username || "User"}
				</Text>
				<TouchableOpacity>
					<UserSetting />
				</TouchableOpacity>
			</View>
		);
	}

	// Chat Header - with title and search icon
	if (type === "chat") {
		return (
			<View className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
				<Text className="text-white font-semibold text-2xl">Chats</Text>
				<TouchableOpacity>
					<SearchIcon size={24} />
				</TouchableOpacity>
			</View>
		);
	}

	// Profile Header - minimal or empty (ProfileScreen has its own header)
	if (type === "profile") {
		return null; // ProfileScreen has its own ProfileHeader component
	}

	// Default header
	return (
		<View className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
			<Text className="text-white font-semibold text-2xl">
				{username || "User"}
			</Text>
		</View>
	);
}
