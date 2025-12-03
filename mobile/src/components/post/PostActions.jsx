import { View, Text, TouchableOpacity } from "react-native";
import { BookmarkIcon, CommentIcon, HeartIcon, ShareIcon } from "../Icons";

export default function PostActions({
	likes = 0,
	comments = 0,
	shares = 0,
	onLike,
	onComment,
	onShare,
	onBookmark,
}) {
	return (
		<View className="flex-row items-center justify-between px-4 pb-2 pt-4">
			<View className="flex-row items-center gap-4">
				<TouchableOpacity
					onPress={onLike}
					className="flex-row items-center gap-2"
				>
					<HeartIcon />
					<Text className="text-white font-semibold">{likes}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onComment}
					className="flex-row items-center gap-2"
				>
					<CommentIcon />
					<Text className="text-white font-semibold">{comments}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onShare}
					className="flex-row items-center gap-2"
				>
					<ShareIcon />
					<Text className="text-white font-semibold">{shares}</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity onPress={onBookmark}>
				<BookmarkIcon />
			</TouchableOpacity>
		</View>
	);
}
