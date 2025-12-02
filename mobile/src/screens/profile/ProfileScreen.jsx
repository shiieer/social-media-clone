import { FlatList, Image, View } from "react-native";
import { ScrollView } from "react-native-web";

const posts = [
	require("../../assets/post1.jpg"),
	require("../../assets/post2.jpg"),
	require("../../assets/post3.jpg"),
	require("../../assets/post4.jpg"),
	require("../../assets/post5.jpg"),
];

export default function Profile() {
	return (
		<ScrollView>
			<View>
				<Image />
				<View></View>
			</View>

			<FlatList
				data={posts}
				keyExtractor={(item, index) => index.toString()}
				numColumns={3}
				renderItem={({ item }) => <Image source={item} />}
			/>
		</ScrollView>
	);
}
