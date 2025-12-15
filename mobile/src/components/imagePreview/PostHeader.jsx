import { View, Image, Text } from "react-native";

/**
 * Post header component showing profile picture and username
 * @param {object} props - Component props
 * @param {object|number} props.profileImage - Profile image source
 * @param {string} props.username - Username to display
 */
export default function PostHeader({ profileImage, username }) {
	if (!profileImage || !username) {
		return null;
	}

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingHorizontal: 12,
				paddingVertical: 10,
				gap: 10,
			}}
		>
			<Image
				source={profileImage}
				style={{
					width: 32,
					height: 32,
					borderRadius: 16,
					borderWidth: 1,
					borderColor: "rgba(255, 255, 255, 0.3)",
				}}
				resizeMode="cover"
			/>
			<View style={{ flex: 1 }}>
				<Text
					style={{
						color: "white",
						fontSize: 14,
						fontWeight: "600",
					}}
				>
					{username}
				</Text>
				<Text
					style={{
						color: "rgba(255, 255, 255, 0.6)",
						fontSize: 12,
					}}
				>
					13 hours ago
				</Text>
			</View>
		</View>
	);
}

