import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
	CreatePost,
	UserSetting,
	SearchIcon,
	NotificationIcon,
	NewChatIcon,
} from "../components/Icons";
import {
	useScreenTransition,
	AnimationPresets,
} from "../hooks/useScreenTransition";

export default function Header({ type = "home", username }) {
	const navigation = useNavigation();
	const { animatedStyle } = useScreenTransition(type, {
		...AnimationPresets.quickFade,
		slideOffset: 20,
	});

	const renderHeaderContent = () => {
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
						<NotificationIcon />
					</TouchableOpacity>
				</View>
			);
		}

		if (type === "chat") {
			return (
				<View className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
					<View className="h-6 w-6"></View>
					<Text className="text-white font-semibold text-2xl">
						{username || "User"}
					</Text>
					<TouchableOpacity onPress={() => navigation.navigate("NewMessage")}>
						<NewChatIcon />
					</TouchableOpacity>
				</View>
			);
		}

		if (type === "profile") {
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

		return (
			<View className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
				<Text className="text-white font-semibold text-2xl">
					{username || "User"}
				</Text>
			</View>
		);
	};

	return (
		<Animated.View style={animatedStyle}>
			{renderHeaderContent()}
		</Animated.View>
	);
}
