import { useState, useContext } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "./Footer";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import Header from "./Header";
import { AuthContext } from "../auth/AuthContext";
import { useScreenTransition } from "../hooks/useScreenTransition";
import AnimatedScreenContainer from "../components/AnimatedScreenContainer";
import { FloatingImagePreview, useImagePreview } from "../components/imagePreview";

export default function MainTabContainer() {
	const [activeTab, setActiveTab] = useState("Home");
	const { user } = useContext(AuthContext);
	const { previewVisible, selectedImage, profileImage, username: previewUsername, closePreview } = useImagePreview();
	
	// Use modular animation hook
	const { animatedStyle, animateOut } = useScreenTransition(activeTab);

	// Get username from user object - handle different possible field names
	const username = user?.username || user?.user?.username || user?.user_name || null;

	const handleTabChange = (tab) => {
		// Don't animate if clicking the same tab
		if (activeTab === tab) {
			return;
		}
		// Animate out before changing tab
		animateOut(() => {
			setActiveTab(tab);
		});
	};

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
				<AnimatedScreenContainer animatedStyle={animatedStyle}>
					{renderContent()}
				</AnimatedScreenContainer>
				<Footer activeTab={activeTab} setActiveTab={handleTabChange} />
			</KeyboardAvoidingView>

			{/* Floating Image Preview - appears above header and everything */}
			<FloatingImagePreview
				visible={previewVisible}
				onClose={closePreview}
				imageSource={selectedImage}
				profileImage={profileImage}
				username={previewUsername}
			/>
		</SafeAreaView>
	);
}
