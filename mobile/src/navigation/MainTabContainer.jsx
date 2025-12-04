import { useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "./Footer";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

export default function MainTabContainer() {
	const [activeTab, setActiveTab] = useState("Home");

	const renderContent = () => {
		switch (activeTab) {
			case "Home":
				return <HomeScreen />;
			case "Profile":
				return <ProfileScreen />;
			default:
				return <HomeScreen />;
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1 bg-dark"
			>
				<View style={{ flex: 1 }}>
					{renderContent()}
				</View>
				<Footer activeTab={activeTab} setActiveTab={setActiveTab} />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

