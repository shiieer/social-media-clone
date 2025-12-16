import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { SearchChat } from "../Icons";

export default function ChatSearchBar({ onFilterPress }) {
	return (
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
			<TouchableOpacity onPress={onFilterPress}>
				<Text className="text-quinary font-bold text-lg">
					Filter
				</Text>
			</TouchableOpacity>
		</View>
	);
}

