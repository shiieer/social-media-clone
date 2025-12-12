import { View, Image } from "react-native";

export default function ProfilePostsGrid({ posts }) {
	return (
		<View
			style={{
				flexDirection: "row",
				flexWrap: "wrap",
				marginTop: 16,
				gap: 2,
			}}
		>
			{posts.map((item, index) => (
				<Image
					key={index}
					source={item}
					style={{ width: "33%", aspectRatio: 1 }}
					resizeMode="cover"
				/>
			))}
		</View>
	);
}



