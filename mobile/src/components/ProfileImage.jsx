import { View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileImage({ 
	source, 
	size = 56, 
	className = "",
	style = {} 
}) {
	const hasImage = source && (typeof source === 'object' ? (source.uri && source.uri.trim() !== '') : source);
	
	if (hasImage) {
		return (
			<Image
				source={source}
				className={`rounded-full ${className}`}
				style={[{ width: size, height: size }, style]}
			/>
		);
	}
	
	// Default icon when no image - using person-circle icon for profile image
	return (
		<View
			className={`rounded-full bg-quaternary items-center justify-center ${className}`}
			style={[{ width: size, height: size }, style]}
		>
			<Ionicons 
				name="person-circle-outline" 
				size={size * 0.9} 
				color="#666" 
			/>
		</View>
	);
}

