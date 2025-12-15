import { HeartIcon, CommentIcon, PinIcon, RepostIcon } from "../Icons";

/**
 * Default menu items configuration for image preview
 */
export const defaultMenuItems = [
	{
		icon: <PinIcon size={24} color="white" />,
		label: "Pin to your main grid",
		onPress: () => console.log("Pin to grid"),
	},
	{
		icon: <HeartIcon size={24} color="white" />,
		label: "Like",
		onPress: () => console.log("Like"),
	},
	{
		icon: <CommentIcon size={24} color="white" />,
		label: "Comment",
		onPress: () => console.log("Comment"),
	},
	{
		icon: <RepostIcon size={24} color="white" />,
		label: "Repost",
		onPress: () => console.log("Repost"),
	},
];

