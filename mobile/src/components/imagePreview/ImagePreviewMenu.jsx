import { useRef } from "react";
import { View, Animated, PanResponder, Dimensions } from "react-native";
import MenuItem from "./MenuItem";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MENU_HEIGHT = 380;
const MENU_MARGIN = 16;
const DRAG_THRESHOLD = 100;
const POST_WIDTH = SCREEN_WIDTH * 0.95;

/**
 * Draggable menu overlay for image preview
 * @param {object} props - Component props
 * @param {Animated.Value} props.dragY - Animated Y translation value
 * @param {Animated.Value} props.opacity - Animated opacity value
 * @param {Array} props.menuItems - Array of menu items with icon, label, onPress
 * @param {function} props.onDismiss - Callback when menu is dismissed
 */
export default function ImagePreviewMenu({
	dragY,
	opacity,
	menuItems,
	onDismiss,
}) {
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, gesture) => {
				return Math.abs(gesture.dy) > 5;
			},
			onPanResponderGrant: () => {
				dragY.setOffset(dragY._value);
				dragY.setValue(0);
			},
			onPanResponderMove: (_, gesture) => {
				const dragAmount = Math.max(0, gesture.dy);
				dragY.setValue(dragAmount);
				const opacityValue = 1 - Math.min(dragAmount / MENU_HEIGHT, 0.5);
				opacity.setValue(opacityValue);
			},
			onPanResponderRelease: (_, gesture) => {
				dragY.flattenOffset();
				const currentDrag = Math.max(0, gesture.dy);

				if (currentDrag > DRAG_THRESHOLD) {
					Animated.parallel([
						Animated.timing(dragY, {
							toValue: MENU_HEIGHT,
							duration: 250,
							useNativeDriver: true,
						}),
						Animated.timing(opacity, {
							toValue: 0,
							duration: 250,
							useNativeDriver: true,
						}),
					]).start(() => {
						onDismiss();
					});
				} else {
					Animated.parallel([
						Animated.spring(dragY, {
							toValue: 0,
							tension: 65,
							friction: 11,
							useNativeDriver: true,
						}),
						Animated.spring(opacity, {
							toValue: 1,
							tension: 65,
							friction: 11,
							useNativeDriver: true,
						}),
					]).start();
				}
			},
		})
	).current;

	return (
		<Animated.View
			style={{
				position: "absolute",
				bottom: SCREEN_HEIGHT * 0.15 + MENU_MARGIN,
				left: SCREEN_WIDTH * 0.025 + MENU_MARGIN,
				width: POST_WIDTH * 0.6,
				maxHeight: MENU_HEIGHT,
				borderRadius: 16,
				overflow: "hidden",
				transform: [{ translateY: dragY }],
				opacity: opacity,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.4,
				shadowRadius: 8,
				elevation: 10,
				zIndex: 20,
			}}
			{...panResponder.panHandlers}
		>
			{/* Semi-transparent Background */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(38, 38, 38, 0.92)",
				}}
			/>

			{/* Menu Content */}
			<View
				style={{
					paddingTop: 12,
					paddingBottom: 20,
				}}
			>
				{/* Drag Handle */}
				<View
					style={{
						width: 50,
						height: 5,
						backgroundColor: "rgba(255, 255, 255, 0.3)",
						borderRadius: 3,
						alignSelf: "center",
						marginBottom: 20,
					}}
				/>

				{/* Menu Items */}
				{menuItems.map((item, index) => (
					<MenuItem
						key={index}
						icon={item.icon}
						label={item.label}
						onPress={item.onPress}
					/>
				))}
			</View>
		</Animated.View>
	);
}

