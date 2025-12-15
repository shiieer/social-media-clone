import { View, Image, Pressable, Dimensions } from "react-native";
import PostHeader from "./PostHeader";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const POST_WIDTH = SCREEN_WIDTH * 0.95;
const POST_IMAGE_HEIGHT = SCREEN_HEIGHT * 0.7;

/**
 * Post card component displaying image with header
 * @param {object} props - Component props
 * @param {object|number} props.imageSource - Image source
 * @param {object|number} props.profileImage - Profile image source (optional)
 * @param {string} props.username - Username to display (optional)
 * @param {function} props.onPress - Callback when image is pressed
 */
export default function PostCard({
	imageSource,
	profileImage,
	username,
	onPress,
}) {
	return (
		<View
			style={{
				width: POST_WIDTH,
				backgroundColor: "#000",
				borderRadius: 12,
				overflow: "hidden",
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.5,
				shadowRadius: 8,
				elevation: 8,
			}}
		>
			<PostHeader profileImage={profileImage} username={username} />
			<Pressable onPress={onPress}>
				<Image
					source={imageSource}
					style={{
						width: POST_WIDTH,
						height: POST_IMAGE_HEIGHT,
						backgroundColor: "#000",
					}}
					resizeMode="cover"
				/>
			</Pressable>
		</View>
	);
}

