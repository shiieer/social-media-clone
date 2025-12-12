import { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	HomeIcon,
	SearchIcon,
	AddIcon,
	ChatIcon,
	HomeIconActive,
	ChatIconActive,
} from "../components/Icons";
import ProfileModal from "../components/ProfileModal";

import profile from "../assets/profile.jpg";

export default function Footer({ activeTab, setActiveTab }) {
	const [visible, setVisible] = useState(false);

	const openMenu = () => {
		setVisible(true);
	};

	const closeMenu = () => {
		setVisible(false);
	};

	const isActive = (screen) => activeTab === screen;

	return (
		<>
			<SafeAreaView
				edges={["bottom"]}
				className="bg-dark border-t border-gray-800"
			>
				<View className="flex-row justify-around items-center py-3">
					<TouchableOpacity
						onPress={() => setActiveTab("Home")}
						className="items-center"
					>
						{isActive("Home") ? <HomeIconActive /> : <HomeIcon />}
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => {}}
						className="items-center"
					>
						<SearchIcon />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => {}}
						className="items-center"
					>
						<AddIcon />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => setActiveTab("Chat")}
						className="items-center"
					>
						{isActive("Chat") ? <ChatIconActive /> : <ChatIcon />}
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => setActiveTab("Profile")}
						onLongPress={openMenu}
						className="items-center"
					>
						{isActive("Profile") ? (
							<Image
								className="rounded-full border-2 border-white"
								source={profile}
								style={{ height: 24, width: 24 }}
								resizeMode="cover"
							/>
						) : (
							<Image
								className="rounded-full"
								source={profile}
								style={{ height: 24, width: 24 }}
								resizeMode="cover"
							/>
						)}
					</TouchableOpacity>
				</View>
			</SafeAreaView>

			<ProfileModal visible={visible} onClose={closeMenu} />
		</>
	);
}
