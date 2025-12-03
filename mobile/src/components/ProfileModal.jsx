import { useContext, useRef, useEffect } from "react";
import {
	View,
	Modal,
	TouchableOpacity,
	Pressable,
	Text,
	Animated,
	PanResponder,
	Dimensions,
} from "react-native";
import { AuthContext } from "../auth/AuthContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5;
const DRAG_THRESHOLD = 100;

export default function ProfileModal({ visible, onClose }) {
	const { logOutUser } = useContext(AuthContext);
	const dragY = useRef(new Animated.Value(0)).current;
	const opacity = useRef(new Animated.Value(1)).current;
	const bgOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			Animated.timing(bgOpacity, {
				toValue: 1,
				duration: 250,
				useNativeDriver: true,
			}).start();
		} else {
			bgOpacity.setValue(0);
		}
	}, [visible]);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, gesture) => {
				return Math.abs(gesture.dy) > 5;
			},
			onPanResponderGrant: () => {
				dragY.setOffset(dragY._value);
				dragY.setValue(0);
			},
			onPanResponderMove: (_, gesture) => {
				// Only allow dragging down (positive dy)
				const dragAmount = Math.max(0, gesture.dy);
				dragY.setValue(dragAmount);
				
				// Smoothly fade modal opacity as you drag down
				const opacityValue = 1 - Math.min(dragAmount / MODAL_HEIGHT, 0.5);
				opacity.setValue(opacityValue);
				
				// Fade background slightly as you drag down (like Instagram)
				const bgOpacityValue = 1 - Math.min(dragAmount / MODAL_HEIGHT, 0.3);
				bgOpacity.setValue(bgOpacityValue);
			},
			onPanResponderRelease: (_, gesture) => {
				dragY.flattenOffset();
				const currentDrag = Math.max(0, gesture.dy);
				
				if (currentDrag > DRAG_THRESHOLD) {
					// Close modal with smooth animation
					Animated.parallel([
						Animated.timing(dragY, {
							toValue: MODAL_HEIGHT,
							duration: 250,
							useNativeDriver: true,
						}),
						Animated.timing(opacity, {
							toValue: 0,
							duration: 250,
							useNativeDriver: true,
						}),
						Animated.timing(bgOpacity, {
							toValue: 0,
							duration: 250,
							useNativeDriver: true,
						}),
					]).start(() => {
						onClose();
						dragY.setValue(0);
						opacity.setValue(1);
						bgOpacity.setValue(0);
					});
				} else {
					// Spring back to original position with smooth animation
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
						Animated.spring(bgOpacity, {
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

	const handleLogout = async () => {
		Animated.timing(bgOpacity, {
			toValue: 0,
			duration: 250,
			useNativeDriver: true,
		}).start(() => {
			onClose();
			dragY.setValue(0);
			bgOpacity.setValue(0);
		});
		await logOutUser();
	};

	return (
		<Modal visible={visible} transparent animationType="none">
			<View style={{ flex: 1 }}>
				<Animated.View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0,0,0,0.4)",
						opacity: bgOpacity,
					}}
				>
					<Pressable
						onPress={onClose}
						style={{ flex: 1 }}
					/>
				</Animated.View>
				<Animated.View
                    className="bg-secondary"
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						height: MODAL_HEIGHT,
						padding: 20,
						paddingBottom: 40,
						borderTopRightRadius: 20,
						borderTopLeftRadius: 20,
						transform: [{ translateY: dragY }],
						opacity: opacity,
					}}
					{...panResponder.panHandlers}
				>
					<View
						style={{
							width: 50,
							height: 5,
							backgroundColor: "#ccc",
							borderRadius: 3,
							alignSelf: "center",
							marginBottom: 20,
						}}
					/>
					<TouchableOpacity
						onPress={handleLogout}
						style={{ paddingVertical: 12 }}
					>
						<Text
							style={{
								fontSize: 16,
								textAlign: "center",
								color: "red",
								fontWeight: "600",
							}}
						>
							Logout
						</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
		</Modal>
	);
}
