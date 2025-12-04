import { useMemo } from "react";
import { Image, View, ScrollView } from "react-native";

const posts = [
	require("../../assets/post1.jpg"),
	require("../../assets/post2.jpg"),
	require("../../assets/post3.jpg"),
	require("../../assets/post4.jpg"),
	require("../../assets/post5.jpg"),
];

export default function ProfileScreen() {
	const memoizedPosts = useMemo(() => posts, []);

	return (
		<ScrollView keyboardShouldPersistTaps="handled" className="flex-1 bg-dark">
			<View>
				<View></View>
			</View>

			<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
				{memoizedPosts.map((item, index) => (
					<Image
						key={index}
						source={item}
						style={{ width: "33.33%", aspectRatio: 1 }}
						resizeMode="cover"
					/>
				))}
			</View>
		</ScrollView>
	);
}
