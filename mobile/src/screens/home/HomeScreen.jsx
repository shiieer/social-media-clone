import React, { useContext } from "react";
import {
	View,
	Image,
	Text,
	Button,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
	Dimensions,
} from "react-native";

import profile from "../../assets/profile.jpg";
import post from "../../assets/post1.jpg";
import { AuthContext } from "../../auth/AuthContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
	const { logOutUser } = useContext(AuthContext);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-dark"
		>
			<ScrollView keyboardShouldPersistTaps="handled">
				<View className="flex-row items-center p-4 gap-2">
					<Image
						className="rounded-full"
						source={profile}
						style={{ height: 48, width: 48 }}
						resizeMode="cover"
					/>
					<Text className="text-white font-bold">Hiyori</Text>
				</View>

				<View>
					<Image
						source={post}
						style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
						resizeMode="cover"
					/>
				</View>

				<Button
					className="color-red-900"
					title="Logout"
					onPress={logOutUser}
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
