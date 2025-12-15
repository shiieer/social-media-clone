import { Animated, Pressable } from "react-native";
import { BlurView } from "expo-blur";

/**
 * Blur backdrop component for image preview
 * @param {object} props - Component props
 * @param {Animated.Value} props.opacity - Animated opacity value
 * @param {boolean} props.visible - Controls visibility
 * @param {function} props.onPress - Callback when backdrop is pressed
 */
export default function BlurBackdrop({ opacity, visible, onPress }) {
	return (
		<Animated.View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				opacity: opacity,
			}}
			pointerEvents={visible ? "auto" : "none"}
		>
			<BlurView
				intensity={100}
				tint="dark"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}}
			/>
			<Animated.View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0, 0, 0, 0.3)",
				}}
			/>
			<Pressable
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 1,
				}}
				onPress={onPress}
			/>
		</Animated.View>
	);
}

