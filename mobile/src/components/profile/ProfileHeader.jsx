import { View, Image, Text } from "react-native";

export default function ProfileHeader({
	profileImage,
	username,
	name,
	postsCount,
	followersCount,
	followingCount,
}) {
	return (
		<View className="flex-row items-center gap-10">
			<View>
				<Image
					className="rounded-full"
					source={profileImage}
					style={{ height: 70, width: 70 }}
				/>
			</View>

			<View className="flex-1 justify-center">
				{name ? (
					<Text className="text-white font-semibold text-base">
						{name}
					</Text>
				) : (
					username && (
						<Text className="text-white font-semibold text-base">
							@{username}
						</Text>
					)
				)}
				<View className="flex-row flex-wrap gap-10 mt-2">
					<View>
						<Text className="text-white font-bold">
							{postsCount}
						</Text>
						<Text className="text-white font-bold">posts</Text>
					</View>
					<View>
						<Text className="text-white font-bold">
							{followersCount}
						</Text>
						<Text className="text-white font-bold">followers</Text>
					</View>
					<View>
						<Text className="text-white font-bold">
							{followingCount}
						</Text>
						<Text className="text-white font-bold">following</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
