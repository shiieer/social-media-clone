import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function PostCaption() {
	const [expand, setExpand] = useState(false);
	return (
		<View className="py-1 px-4">
			<TouchableOpacity onPress={() => setExpand(!expand)}>
				<Text
					className="text-white"
					style={{ textAlign: "justify", paddingRight: "1rem" }}
					numberOfLines={expand ? null : 1}
					ellipsizeMode="tail"
				>
					I used to wait for people to approve my dreams, to clap for
					me, to tell me I was doing the right thing. But life taught
					me something important: the confidence I was searching for
					had to come from within.
				</Text>
			</TouchableOpacity>
		</View>
	);
}
