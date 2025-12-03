import { useState, useRef, useEffect } from "react";
import {
	View,
	Image,
	Dimensions,
	ScrollView,
	StyleSheet,
	Animated,
	Text,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PostImage({
	source,
	width = SCREEN_WIDTH,
	height = SCREEN_WIDTH,
}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showCount, setShowCount] = useState(false);
	const scrollViewRef = useRef(null);
	const indicatorAnimations = useRef([]);
	const hideTimeoutRef = useRef(null);
	const countOpacity = useRef(new Animated.Value(0)).current;

	// Handle both single image and array of images
	const images = Array.isArray(source) ? source : [source];

	// Initialize animated values for each indicator
	useEffect(() => {
		indicatorAnimations.current = images.map((_, index) => ({
			width: new Animated.Value(index === 0 ? 20 : 6),
			opacity: new Animated.Value(index === 0 ? 1 : 0.4),
		}));
	}, [images.length]);

	// Animate indicator when currentIndex changes
	useEffect(() => {
		indicatorAnimations.current.forEach((anim, index) => {
			const isActive = index === currentIndex;
			Animated.parallel([
				Animated.timing(anim.width, {
					toValue: isActive ? 20 : 6,
					duration: 200,
					useNativeDriver: false,
				}),
				Animated.timing(anim.opacity, {
					toValue: isActive ? 1 : 0.4,
					duration: 200,
					useNativeDriver: false,
				}),
			]).start();
		});
	}, [currentIndex]);

	if (!source || images.length === 0) {
		return null;
	}

	const showCountIndicator = () => {
		// Clear existing timeout
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
		}

		// Show count with animation
		if (!showCount) {
			setShowCount(true);
			Animated.timing(countOpacity, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}).start();
		}

		// Set timeout to hide after 3 seconds
		hideTimeoutRef.current = setTimeout(() => {
			Animated.timing(countOpacity, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start(() => {
				setShowCount(false);
			});
		}, 3000);
	};

	const handleScroll = (event) => {
		const scrollPosition = event.nativeEvent.contentOffset.x;
		const index = Math.round(scrollPosition / width);
		if (index !== currentIndex) {
			setCurrentIndex(index);
		}
		// Show count when scrolling
		showCountIndicator();
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current);
			}
		};
	}, []);

	return (
		<View style={{ width, height, position: "relative" }}>
			<ScrollView
				ref={scrollViewRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				style={{ width, height }}
			>
				{images.map((img, index) => (
					<Image
						key={index}
						source={img}
						style={{ width, height }}
						resizeMode="cover"
					/>
				))}
			</ScrollView>

			{/* Animated indicator dots - only show if more than one image */}
			{images.length > 1 && (
				<View style={styles.indicatorContainer} pointerEvents="none">
					{images.map((_, index) => {
						const anim = indicatorAnimations.current[index];
						if (!anim) return null;

						return (
							<Animated.View
								key={index}
								style={[
									styles.indicator,
									{
										width: anim.width,
										opacity: anim.opacity,
									},
								]}
							/>
						);
					})}
				</View>
			)}

			{/* Count overlay - rendered last to appear on top */}
			{images.length > 1 && showCount && (
				<Animated.View
					style={[styles.countContainer, { opacity: countOpacity }]}
					pointerEvents="none"
				>
					<Text style={styles.countText}>
						{currentIndex + 1} / {images.length}
					</Text>
				</Animated.View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	indicatorContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 8,
		left: 0,
		right: 0,
	},
	indicator: {
		height: 6,
		borderRadius: 3,
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		marginHorizontal: 3,
	},
	countContainer: {
		position: "absolute",
		top: 10,
		right: 10,
		backgroundColor: "rgba(53, 53, 53, 0.7)",
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderRadius: 12,
		zIndex: 1000,
		elevation: 10, // For Android
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	countText: {
		color: "rgba(255, 255, 255, 0.9)",
		fontSize: 12,
		fontWeight: "600",
	},
});
