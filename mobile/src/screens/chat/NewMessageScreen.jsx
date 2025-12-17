import { useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, SearchChat } from "../../components/Icons";
import ProfileImage from "../../components/ProfileImage";
import { AuthContext } from "../../auth/AuthContext";
import { useSuggestedUsers } from "../../hooks/useSuggestedUsers";
import { ChatApi } from "../../api/chat/ChatApi";
import { getProfileImageSource, getMessageDetailParams } from "../../utils/chatHelpers";

export default function NewMessageScreen() {
	const navigation = useNavigation();
	const authContext = useContext(AuthContext);
	const user = authContext?.user || null;
	const {
		suggestedUsers,
		filteredUsers,
		loading,
		error,
		fetchSuggestedUsers,
		searchQuery,
		setSearchQuery,
	} = useSuggestedUsers(user?.accessToken);

	useEffect(() => {
		if (user?.accessToken) {
			fetchSuggestedUsers();
		}
	}, [user?.accessToken, fetchSuggestedUsers]);

	const handleUserPress = async (selectedUser) => {
		try {
			const result = await ChatApi.getOrCreateRoom(user.accessToken, selectedUser.id);
			
			if (result.success) {
				const room = result.data;
				const params = getMessageDetailParams(room, selectedUser);
				navigation.navigate("MessageDetail", params);
			}
		} catch (err) {
			console.error("Error creating/getting room:", err);
		}
	};

	if (loading) {
		return (
			<SafeAreaView
				style={{ flex: 1 }}
				edges={["top", "left", "right"]}
				className="bg-dark"
			>
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" color="#fff" />
				</View>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView
				style={{ flex: 1 }}
				edges={["top", "left", "right"]}
				className="bg-dark"
			>
				<View className="flex-1 justify-center items-center p-6">
					<Text className="text-white text-center mb-4">{error}</Text>
					<Text 
						className="text-primary underline"
						onPress={fetchSuggestedUsers}
					>
						Tap to retry
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView
			style={{ flex: 1 }}
			edges={["top", "left", "right"]}
			className="bg-dark"
		>
			{/* Header */}
			<View className="flex-row items-center justify-between px-4 pt-4 pb-2 border-b border-gray-800">
				<TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
					<ArrowLeft />
				</TouchableOpacity>
				<Text className="text-white font-bold text-lg flex-1 text-center">
					New Message
				</Text>
				<View className="w-10" />
			</View>

			{/* Search Bar */}
			<View className="flex-row items-center px-6 py-4">
				<View className="flex flex-row items-center px-4 flex-1 rounded-2xl bg-quaternary gap-2">
					<SearchChat />
					<TextInput
						className="text-white flex-1"
						placeholder="Search"
						placeholderTextColor="#999"
						value={searchQuery}
						onChangeText={setSearchQuery}
						autoCorrect={false}
					/>
				</View>
			</View>

			{/* Suggested Users List */}
			<ScrollView className="flex-1">
				<View className="px-6 py-4">
					<Text className="text-white text-lg font-bold mb-4">
						Suggested
					</Text>
					{filteredUsers.length === 0 ? (
						<View className="py-8 items-center">
							<Text className="text-gray-400 text-center">
								{searchQuery.trim() 
									? "No users found" 
									: "No suggested users available"}
							</Text>
						</View>
					) : (
						<View className="flex gap-3">
							{filteredUsers.map((suggestedUser) => (
								<TouchableOpacity
									key={suggestedUser.id}
									className="flex-row items-center gap-4"
									onPress={() => handleUserPress(suggestedUser)}
									activeOpacity={0.7}
								>
									<ProfileImage
										source={getProfileImageSource(suggestedUser)}
										size={56}
									/>
									<View className="flex-1">
										<Text className="text-white font-semibold">
											{suggestedUser.username}
										</Text>
										{suggestedUser.bio && (
											<Text 
												className="text-messagetext text-sm" 
												numberOfLines={1}
											>
												{suggestedUser.bio}
											</Text>
										)}
									</View>
								</TouchableOpacity>
							))}
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
