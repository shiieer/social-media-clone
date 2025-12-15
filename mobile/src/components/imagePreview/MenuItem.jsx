import { View, Text, TouchableOpacity } from "react-native";

/**
 * Individual menu item component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.label - Menu item label
 * @param {function} props.onPress - Callback when item is pressed
 */
export default function MenuItem({ icon, label, onPress }) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingHorizontal: 20,
				paddingVertical: 16,
			}}
			activeOpacity={0.7}
		>
			<View style={{ marginRight: 16 }}>{icon}</View>
			<Text
				style={{
					color: "white",
					fontSize: 16,
					fontWeight: "400",
				}}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);
}

