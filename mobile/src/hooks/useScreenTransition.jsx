import { useEffect, useRef } from "react";
import { Animated } from "react-native";

/**
 * Animation configuration presets
 */
export const AnimationPresets = {
	fadeSlide: {
		fadeOutDuration: 150,
		fadeInDuration: 300,
		slideOffset: 50,
		springTension: 50,
		springFriction: 7,
	},
	quickFade: {
		fadeOutDuration: 100,
		fadeInDuration: 200,
		slideOffset: 30,
		springTension: 60,
		springFriction: 8,
	},
	smoothFade: {
		fadeOutDuration: 200,
		fadeInDuration: 400,
		slideOffset: 40,
		springTension: 45,
		springFriction: 6,
	},
};

/**
 * Custom hook for screen transition animations
 * @param {string} activeKey - The key that triggers animation when changed
 * @param {object} config - Animation configuration (defaults to fadeSlide preset)
 * @returns {object} - Animation values and handler function
 */
export const useScreenTransition = (activeKey, config = AnimationPresets.fadeSlide) => {
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const slideAnim = useRef(new Animated.Value(0)).current;

	// Animate screen transitions when activeKey changes
	useEffect(() => {
		// Reset and animate fade in with slide
		fadeAnim.setValue(0);
		slideAnim.setValue(config.slideOffset);

		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: config.fadeInDuration,
				useNativeDriver: true,
			}),
			Animated.spring(slideAnim, {
				toValue: 0,
				tension: config.springTension,
				friction: config.springFriction,
				useNativeDriver: true,
			}),
		]).start();
	}, [activeKey, config]);

	/**
	 * Handler function to animate out before state change
	 * @param {Function} callback - Function to call after fade out completes
	 */
	const animateOut = (callback) => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: config.fadeOutDuration,
			useNativeDriver: true,
		}).start(callback);
	};

	/**
	 * Animation style object for Animated.View
	 */
	const animatedStyle = {
		opacity: fadeAnim,
		transform: [{ translateY: slideAnim }],
	};

	return {
		animatedStyle,
		animateOut,
		fadeAnim,
		slideAnim,
	};
};

