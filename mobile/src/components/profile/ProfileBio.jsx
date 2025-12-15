import { View, Text } from "react-native";

export default function ProfileBio({ bio }) {
	return (
		<View>
			<Text className="text-white">{bio || "Bio"}</Text>
		</View>
	);
}





