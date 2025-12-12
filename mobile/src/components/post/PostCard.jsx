import { View } from "react-native";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";

export default function PostCard({
	profileImage,
	username,
	postImage,
	likes = 0,
	comments = 0,
	shares = 0,
	onLike,
	onComment,
	onShare,
	onBookmark,
}) {
	return (
		<View className="mb-5">
			<PostHeader profileImage={profileImage} username={username} />
			<PostImage source={postImage} />
			<PostActions
				likes={likes}
				comments={comments}
				shares={shares}
				onLike={onLike}
				onComment={onComment}
				onShare={onShare}
				onBookmark={onBookmark}
			/>
			<PostCaption />
		</View>
	);
}
