import { ScrollView } from "react-native";

import profile from "../../assets/profile.jpg";
import post1 from "../../assets/post1.jpg";
import post2 from "../../assets/post2.jpg";
import post3 from "../../assets/post3.jpg";
import post4 from "../../assets/post4.jpg";
import PostCard from "../../components/post/PostCard";

export default function HomeScreen() {
	const handleLike = () => {
		console.log("Like pressed");
	};

	const handleComment = () => {
		console.log("Comment pressed");
	};

	const handleShare = () => {
		console.log("Share pressed");
	};

	const handleBookmark = () => {
		console.log("Bookmark pressed");
	};

	return (
		<ScrollView keyboardShouldPersistTaps="handled" className="flex-1 bg-dark">
			<PostCard
				profileImage={profile}
				username="Hiyori"
				postImage={[post1, post2, post3, post4]}
				likes={123}
				comments={45}
				shares={5}
				onLike={handleLike}
				onComment={handleComment}
				onShare={handleShare}
				onBookmark={handleBookmark}
			/>
		</ScrollView>
	);
}
