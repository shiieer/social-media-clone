import {
	View,
	Text,
	ScrollView,
	Image,
	TouchableOpacity,
	TextInput,
} from "react-native";
import profile from "../../assets/profile.jpg";
import { SearchChat } from "../../components/Icons";

export default function ChatScreen() {
	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			className="flex-1 bg-dark"
		>
			<View className="flex-row items-center justify-between p-6">
				<View className="flex flex-row items-center px-4 w-[85%] rounded-2xl bg-quaternary gap-2">
					<SearchChat />
					<TextInput
						className="text-white w-full"
						placeholder="Search"
						placeholderTextColor="#999"
						keyboardType="default"
						autoCorrect={false}
					/>
				</View>
				<TouchableOpacity>
					<Text className="text-quinary font-bold text-lg">
						Filter
					</Text>
				</TouchableOpacity>
			</View>

			<View className="p-6">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center gap-4">
						<Image
							source={profile}
							className="rounded-full"
							style={{ width: 56, height: 56 }}
						/>
						<View>
							<Text className="text-white font-semibold">
								Hiyori
							</Text>
							<Text className="text-messagetext">
								How are you?
							</Text>
						</View>
					</View>
					<View className="bg-primary rounded-full p-1"></View>
				</View>
			</View>
		</ScrollView>
	);
}
