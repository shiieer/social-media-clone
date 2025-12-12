import { useState, useContext } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "./Footer";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import Header from "./Header";
import { AuthContext } from "../auth/AuthContext";

export default function MainTabContainer() {
	const [activeTab, setActiveTab] = useState("Home");
	const { user } = useContext(AuthContext);

	// Get username from user object - handle different possible field names
	const username = user?.username || user?.user?.username || user?.user_name || null;

	const renderContent = () => {
		switch (activeTab) {
			case "Home":
				return <HomeScreen />;
			case "Profile":
				return <ProfileScreen />;
			case "Chat":
				return <ChatScreen />;
			default:
				return <HomeScreen />;
		}
	};

	// Determine header type based on active tab
	const getHeaderType = () => {
		switch (activeTab.toLowerCase()) {
			case "home":
				return "home";
			case "chat":
				return "chat";
			case "profile":
				return "profile";
			default:
				return "home";
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1 bg-dark"
			>
				<Header type={getHeaderType()} username={username} />
				<View style={{ flex: 1 }}>{renderContent()}</View>
				<Footer activeTab={activeTab} setActiveTab={setActiveTab} />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
