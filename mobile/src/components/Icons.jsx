import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const HomeIcon = ({ size = 24, color = "white" }) => (
	<Octicons name="home" size={size} color={color} />
);

export const HomeIconActive = ({ size = 24, color = "white" }) => (
	<Octicons name="home-fill" size={size} color={color} />
);

export const SearchIcon = ({ size = 24, color = "white" }) => (
	<Feather name="search" size={size} color={color} />
);

export const AddIcon = ({ size = 24, color = "white" }) => (
	<FontAwesome6 name="add" size={size} color={color} />
);

export const ChatIcon = ({ size = 24, color = "white" }) => (
	<Ionicons
		name="chatbubble-outline"
		size={size}
		color={color}
		style={{ transform: [{ scaleX: -1 }] }}
	/>
);

export const ChatIconActive = ({ size = 24, color = "white" }) => (
	<Ionicons
		name="chatbubble-sharp"
		size={size}
		color={color}
		style={{ transform: [{ scaleX: -1 }] }}
	/>
);

export const HeartIcon = ({ size = 16, color = "white" }) => (
	<FontAwesome name="heart-o" size={size} color={color} />
);

export const CommentIcon = ({ size = 16, color = "white" }) => (
	<Ionicons
		name="chatbubble-outline"
		size={size}
		color={color}
		style={{ transform: [{ scaleX: -1 }] }}
	/>
);

export const ShareIcon = ({ size = 16, color = "white" }) => (
	<Ionicons name="paper-plane-outline" size={size} color={color} />
);

export const BookmarkIcon = ({ size = 16, color = "white" }) => (
	<FontAwesome5 name="bookmark" size={size} color={color} />
);

export const CreatePost = ({ size = 24, color = "white" }) => (
	<AntDesign name="plus" size={size} color={color} />
);

export const UserSetting = ({ size = 24, color = "white" }) => (
	<AntDesign name="menu" size={size} color={color} />
);

export const PostMenu = ({ size = 16, color = "white" }) => (
	<Entypo name="dots-three-vertical" size={size} color={color} />
);

export const SearchChat = ({ size = 16, color = "white" }) => (
	<MaterialCommunityIcons
		name="account-search-outline"
		size={size}
		color={color}
	/>
);
