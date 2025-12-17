import { View, Text, Animated, StyleSheet } from "react-native";
import { useRef, useEffect } from "react";

export default function MessageBubble({
	message,
	isSent,
	isNew = false,
	isFirst = false,
	isLast = false,
	marginBottom = 16,
	isRead = true,
}) {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.8)).current;
	const isMounted = useRef(false);

	useEffect(() => {
		if (isNew) {
			// Reset values first
			fadeAnim.setValue(0);
			scaleAnim.setValue(0.8);

			// Start animation after a tiny delay to ensure component is mounted
			const timeoutId = setTimeout(() => {
				Animated.parallel([
					Animated.timing(fadeAnim, {
						toValue: 1,
						duration: 300,
						useNativeDriver: true,
					}),
					Animated.spring(scaleAnim, {
						toValue: 1,
						tension: 50,
						friction: 7,
						useNativeDriver: true,
					}),
				]).start();
			}, 10);

			return () => clearTimeout(timeoutId);
		} else if (!isMounted.current) {
			// For existing messages, show immediately on first mount
			fadeAnim.setValue(1);
			scaleAnim.setValue(1);
			isMounted.current = true;
		}
	}, [isNew, fadeAnim, scaleAnim]);

	return (
		<Animated.View
			className={`flex-row ${isSent ? "justify-end" : "justify-start"}`}
			style={{
				opacity: fadeAnim,
				transform: [{ scale: scaleAnim }],
				marginBottom: marginBottom,
			}}
		>
			<View
				className={`max-w-[75%] px-4 py-2 ${
					isSent ? "bg-primary" : "bg-quaternary"
				}`}
				style={[
					styles.bubble,
					isSent ? styles.sentBorder : styles.receivedBorder,
					getBorderRadius(isSent, isFirst, isLast),
				]}
			>
				<Text className="text-white">{message.text}</Text>
				<View className="flex-row items-center justify-end gap-1 mt-1">
					<Text className="text-xs text-messagetext">
						{message.timestamp}
					</Text>
					{/* Blue dot for unread sent messages (Instagram style) */}
					{isSent && !isRead && (
						<View 
							className="bg-blue-500 rounded-full"
							style={{ width: 8, height: 8 }}
						/>
					)}
				</View>
			</View>
		</Animated.View>
	);
}

const getBorderRadius = (isSent, isFirst, isLast) => {
	const baseRadius = 18;

	if (isSent) {
		if (isFirst && isLast) {
			// Only one message
			return {
				borderTopLeftRadius: baseRadius,
				borderBottomLeftRadius: baseRadius,
				borderTopRightRadius: baseRadius,
				borderBottomRightRadius: 0,
			};
		} else if (isFirst) {
			// First message in group
			return {
				borderTopLeftRadius: baseRadius,
				borderBottomLeftRadius: baseRadius,
				borderTopRightRadius: baseRadius,
				borderBottomRightRadius: 0,
			};
		} else if (isLast) {
			// Last message in group
			return {
				borderTopLeftRadius: baseRadius,
				borderBottomLeftRadius: baseRadius,
				borderTopRightRadius: 0,
				borderBottomRightRadius: baseRadius,
			};
		} else {
			// Middle message
			return {
				borderTopLeftRadius: baseRadius,
				borderBottomLeftRadius: baseRadius,
				borderTopRightRadius: 0,
				borderBottomRightRadius: 0,
			};
		}
	} else {
		// Received messages: rounded on right, flat on left
		if (isFirst && isLast) {
			// Only one message
			return {
				borderTopLeftRadius: baseRadius,
				borderBottomLeftRadius: 0,
				borderTopRightRadius: baseRadius,
				borderBottomRightRadius: baseRadius,
			};
		} else if (isFirst) {
			// First message in group
			return {
				borderTopLeftRadius: baseRadius,
				borderBottomLeftRadius: 0,
				borderTopRightRadius: baseRadius,
				borderBottomRightRadius: baseRadius,
			};
		} else if (isLast) {
			// Last message in group
			return {
				borderTopLeftRadius: 0,
				borderBottomLeftRadius: baseRadius,
				borderTopRightRadius: baseRadius,
				borderBottomRightRadius: baseRadius,
			};
		} else {
			// Middle message
			return {
				borderTopLeftRadius: 0,
				borderBottomLeftRadius: 0,
				borderTopRightRadius: baseRadius,
				borderBottomRightRadius: baseRadius,
			};
		}
	}
};

const styles = StyleSheet.create({
	bubble: {
		borderWidth: 0.5,
	},
	sentBorder: {
		borderColor: "rgba(139, 92, 246, 0.3)", // Primary color with opacity
	},
	receivedBorder: {
		borderColor: "rgba(255, 255, 255, 0.1)", // White with low opacity
	},
});
