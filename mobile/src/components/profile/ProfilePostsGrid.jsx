import { View, Image, TouchableOpacity } from "react-native";

export default function ProfilePostsGrid({ posts, onImageLongPress }) {
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
				<TouchableOpacity
					key={index}
					style={{
						width: "33%",
						aspectRatio: 1,
						overflow: "hidden",
					}}
					activeOpacity={0.7}
					onLongPress={() => onImageLongPress?.(item)}
				>
					<Image
						source={item}
						style={{
							width: "100%",
							height: "100%",
						}}
						resizeMode="cover"
					/>
				</TouchableOpacity>
			))}
		</View>
	);
}
