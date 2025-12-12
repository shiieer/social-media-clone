import { useEffect, useMemo, useContext, useState, useCallback } from "react";
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Text,
} from "react-native";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileBio from "../../components/profile/ProfileBio";
import ProfileActions from "../../components/profile/ProfileActions";
import ProfilePostsGrid from "../../components/profile/ProfilePostsGrid";
import defaultProfileImage from "../../assets/profile.jpg";

import { AuthContext } from "../../auth/AuthContext";
import { getMyProfile } from "../../api/profile/ProfileApi";

const posts = [
	require("../../assets/post1.jpg"),
	require("../../assets/post2.jpg"),
	require("../../assets/post3.jpg"),
	require("../../assets/post4.jpg"),
	require("../../assets/post5.jpg"),
];

export default function ProfileScreen() {
	const memoizedPosts = useMemo(() => posts, []);

	const { user, initializing } = useContext(AuthContext);
	const [profileData, setProfileData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const accessToken = user?.accessToken;

	const loadProfile = useCallback(async () => {
		if (!accessToken) {
			setError("No access token available. Please login.");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const res = await getMyProfile(accessToken);

			console.log("Profile API Response:", JSON.stringify(res, null, 2));

			if (res.success) {
				// Backend returns { success: true, data: { ...profile data } }
				// ApiClient wraps it: { success: true, data: { success: true, data: {...} } }
				const profileData = res.data?.data || res.data;

				if (profileData) {
					setProfileData(profileData);
				} else {
					setError("Invalid profile data structure");
				}
			} else {
				setError(res.error || "Failed to load profile");
			}
		} catch (error) {
			console.error("PROFILE ERROR:", error);
			setError(error.message || "Failed to load profile");
		} finally {
			setLoading(false);
		}
	}, [accessToken]);

	useEffect(() => {
		// Wait for auth to initialize before loading profile
		if (!initializing && accessToken) {
			loadProfile();
		} else if (!initializing && !accessToken) {
			setError("Please login to view your profile");
			setLoading(false);
		}
	}, [accessToken, initializing, loadProfile]);

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-dark">
				<Text className="text-white">Loading profile...</Text>
			</View>
		);
	}

	if (error || !profileData) {
		return (
			<View className="flex-1 items-center justify-center bg-dark">
				<Text className="text-white">
					{error || "Failed to load profile"}
				</Text>
			</View>
		);
	}

	const handleEditProfile = () => {
		console.log("Edit Profile pressed");
		// TODO: Navigate to edit profile screen
	};

	const handleShareProfile = () => {
		console.log("Share Profile pressed");
		// TODO: Implement share functionality
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-dark"
		>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				className="flex-grow"
			>
				<View className="px-4 py-6 gap-4">
					<ProfileHeader
						profileImage={
							profileData.avatar
								? { uri: profileData.avatar }
								: defaultProfileImage
						}
						username={profileData.username || "User"}
						name={profileData.name}
						postsCount={profileData.posts_count || 0}
						followersCount={profileData.followers_count || 0}
						followingCount={profileData.following_count || 0}
					/>

					<ProfileBio bio={profileData.bio} />

					<ProfileActions
						onEditPress={handleEditProfile}
						onSharePress={handleShareProfile}
					/>
				</View>

				<ProfilePostsGrid posts={memoizedPosts} />
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
