import { useRef, useEffect, useState } from "react";
import { View, Animated } from "react-native";
import BlurBackdrop from "./BlurBackdrop";
import PostCard from "./PostCard";
import ImagePreviewMenu from "./ImagePreviewMenu";
import { defaultMenuItems } from "./menuItems";

const MENU_HEIGHT = 380;

/**
 * Floating image preview that appears over the profile page
 * @param {object} props - Component props
 * @param {boolean} props.visible - Controls visibility
 * @param {function} props.onClose - Callback when closed
 * @param {object|number} props.imageSource - Image source
 * @param {object|number} props.profileImage - Profile image source (optional)
 * @param {string} props.username - Username to display (optional)
 */
export default function FloatingImagePreview({
	visible,
	onClose,
	imageSource,
	profileImage,
	username,
}) {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const imageScale = useRef(new Animated.Value(0.8)).current;
	const menuDragY = useRef(new Animated.Value(MENU_HEIGHT)).current;
	const menuOpacity = useRef(new Animated.Value(0)).current;
	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.spring(imageScale, {
					toValue: 1,
					tension: 50,
					friction: 7,
					useNativeDriver: true,
				}),
			]).start();

			// Show menu after image appears
			setTimeout(() => {
				setShowMenu(true);
				Animated.parallel([
					Animated.spring(menuDragY, {
						toValue: 0,
						tension: 65,
						friction: 11,
						useNativeDriver: true,
					}),
					Animated.timing(menuOpacity, {
						toValue: 1,
						duration: 250,
						useNativeDriver: true,
					}),
				]).start();
			}, 400);
		} else {
			fadeAnim.setValue(0);
			imageScale.setValue(0.8);
			menuDragY.setValue(MENU_HEIGHT);
			menuOpacity.setValue(0);
			setShowMenu(false);
		}
	}, [visible]);

	const handleMenuDismiss = () => {
		setShowMenu(false);
	};

	const handleClose = () => {
		if (showMenu) {
			Animated.parallel([
				Animated.timing(menuDragY, {
					toValue: MENU_HEIGHT,
					duration: 250,
					useNativeDriver: true,
				}),
				Animated.timing(menuOpacity, {
					toValue: 0,
					duration: 250,
					useNativeDriver: true,
				}),
			]).start(() => {
				handleMenuDismiss();
				Animated.parallel([
					Animated.timing(fadeAnim, {
						toValue: 0,
						duration: 300,
						useNativeDriver: true,
					}),
					Animated.timing(imageScale, {
						toValue: 0.8,
						duration: 300,
						useNativeDriver: true,
					}),
				]).start(() => {
					onClose();
				});
			});
		} else {
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(imageScale, {
					toValue: 0.8,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start(() => {
				onClose();
			});
		}
	};

	const menuItemsWithClose = defaultMenuItems.map((item) => ({
		...item,
		onPress: () => {
			item.onPress();
			handleClose();
		},
	}));

	if (!visible || !imageSource) {
		return null;
	}

	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 9999,
				elevation: 9999,
			}}
			pointerEvents="box-none"
		>
			<BlurBackdrop opacity={fadeAnim} visible={visible} onPress={handleClose} />

			{/* Post Card Container */}
			<Animated.View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					opacity: fadeAnim,
					transform: [{ scale: imageScale }],
					zIndex: 10,
				}}
			>
				<PostCard
					imageSource={imageSource}
					profileImage={profileImage}
					username={username}
					onPress={handleClose}
				/>

				{/* Menu Overlay */}
				{showMenu && (
					<ImagePreviewMenu
						dragY={menuDragY}
						opacity={menuOpacity}
						menuItems={menuItemsWithClose}
						onDismiss={handleMenuDismiss}
					/>
				)}
			</Animated.View>
		</View>
	);
}
