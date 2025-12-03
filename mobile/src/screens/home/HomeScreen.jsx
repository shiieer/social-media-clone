import React, { useContext } from "react";
import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import profile from "../../assets/profile.jpg";
import post1 from "../../assets/post1.jpg";
import post2 from "../../assets/post2.jpg";
import post3 from "../../assets/post3.jpg";
import post4 from "../../assets/post4.jpg";
import { AuthContext } from "../../auth/AuthContext";
import Footer from "../../navigation/Footer";
import PostCard from "../../components/post/PostCard";

export default function HomeScreen() {
	const { logOutUser } = useContext(AuthContext);

	const handleLike = () => {
		console.log("Like pressed");
	};

	const handleComment = () => {
		console.log("Comment pressed");
	};

	const handleShare = () => {
		console.log("Share pressed");
	};

	const handleBookmark = () => {
		console.log("Bookmark pressed");
	};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1 bg-dark"
			>
				<ScrollView keyboardShouldPersistTaps="handled">
					<PostCard
						profileImage={profile}
						username="Hiyori"
						postImage={[post1, post2, post3, post4]}
						likes={123}
						comments={45}
						shares={5}
						onLike={handleLike}
						onComment={handleComment}
						onShare={handleShare}
						onBookmark={handleBookmark}
					/>
				</ScrollView>
				<Footer />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
