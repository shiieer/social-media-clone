import { Animated } from "react-native";

/**
 * Reusable animated screen container component
 * @param {object} props - Component props
 * @param {object} props.animatedStyle - Style object from useScreenTransition hook
 * @param {React.ReactNode} props.children - Child components to render
 * @param {object} props.style - Additional styles to apply
 */
export default function AnimatedScreenContainer({ animatedStyle, children, style }) {
	return (
		<Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
			{children}
		</Animated.View>
	);
}

