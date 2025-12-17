import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft } from "../Icons";
import ProfileImage from "../ProfileImage";

export default function MessageHeader({ username, profileImage, onBackPress, unreadCount = 0 }) {
	return (
		<View className="flex-row items-center justify-between px-4 pt-4 pb-2 border-b border-gray-800">
			<TouchableOpacity onPress={onBackPress} className="p-2">
				<ArrowLeft />
			</TouchableOpacity>
			<View className="flex-row items-center gap-3 flex-1">
				<View className="relative">
					<ProfileImage
						source={profileImage}
						size={40}
					/>
					{/* Unread badge indicator (Instagram style) */}
					{unreadCount > 0 && (
						<View className="absolute -top-1 -right-1 bg-blue-500 rounded-full items-center justify-center min-w-[20px] h-5 px-1.5 border-2 border-dark">
							<Text className="text-white text-xs font-bold">
								{unreadCount > 99 ? "99+" : unreadCount}
							</Text>
						</View>
					)}
				</View>
				<View className="flex-1">
					<Text className="text-white font-semibold text-lg">
						{username || "User"}
					</Text>
					{unreadCount > 0 && (
						<Text className="text-blue-400 text-xs mt-0.5">
							{unreadCount} new message{unreadCount > 1 ? "s" : ""}
						</Text>
					)}
				</View>
			</View>
			<View className="w-10" />
		</View>
	);
}

