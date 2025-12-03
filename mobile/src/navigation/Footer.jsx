import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeIcon, SearchIcon, AddIcon, ChatIcon } from "../components/Icons";

import profile from "../assets/profile.jpg";

export default function Footer() {
	const navigation = useNavigation();

	return (
		<SafeAreaView edges={["bottom"]} className="bg-dark border-t border-gray-800">
			<View className="flex-row justify-around items-center py-3">
				<TouchableOpacity
					onPress={() => navigation.navigate("Home")}
					className="items-center"
				>
					<HomeIcon />
				</TouchableOpacity>

				<TouchableOpacity onPress={() => {}} className="items-center">
					<SearchIcon />
				</TouchableOpacity>

				<TouchableOpacity onPress={() => {}} className="items-center">
					<AddIcon />
				</TouchableOpacity>

				<TouchableOpacity onPress={() => {}} className="items-center">
					<ChatIcon />
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => navigation.navigate("Profile")}
					className="items-center"
				>
					<Image
						className="rounded-full"
						source={profile}
						style={{ height: 24, width: 24 }}
						resizeMode="cover"
					/>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
