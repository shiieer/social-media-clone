import { View, Text, TouchableOpacity } from "react-native";

export default function ProfileActions({
	onEditPress,
	onSharePress,
	editLabel = "Edit Profile",
	shareLabel = "Share Profile",
}) {
	return (
		<View className="flex-row justify-between">
			<TouchableOpacity
				onPress={onEditPress}
				className="flex justify-center p-2 items-center content-center w-[48%] bg-tertiary rounded-xl"
			>
				<Text className="text-white font-bold">{editLabel}</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={onSharePress}
				className="flex justify-center p-2 items-center content-center w-[48%] bg-tertiary rounded-xl"
			>
				<Text className="text-white font-bold">{shareLabel}</Text>
			</TouchableOpacity>
		</View>
	);
}





