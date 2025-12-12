import React, { useContext, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Pressable,
} from "react-native";
import { AuthContext } from "../../auth/AuthContext";

export default function LoginScreen({ navigation }) {
	const { loginUser } = useContext(AuthContext);
	const [form, setForm] = useState({
		username: "",
		password: "",
	});

	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLogin = async () => {
		setError("");
		setIsSubmitting(true);

		const username = form.username.trim();
		const password = form.password;

		if (!username || !password) {
			setError("Please fill all fields");
			setIsSubmitting(false);
			return;
		}

		console.log("Sending login data:", form);

		try {
			const res = await loginUser({ username, password });
			console.log("Login results:", res);

			if (!res.success) {
				const message =
					typeof res.error === "string" && res.error.length > 0
						? res.error
						: "Username or password invalid";
				setError(message);
				Alert.alert("Login failed", message);
			} else {
				console.log("Login successful");
			}
		} catch (error) {
			console.error("Login error:", error);
			const errorMessage =
				error?.message || "Login failed. Please try again.";
			setError(errorMessage);
			Alert.alert("Error", errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const [showPassword, setShowPassword] = useState(false);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-dark"
		>
			<ScrollView
				contentContainerClassName="flex-grow items-center justify-center px-4 py-8"
				keyboardShouldPersistTaps="handled"
			>
				<Text className="text-white font-bold text-2xl mb-8">
					Login
				</Text>

				<View className="w-full max-w-xs gap-4">
					<TextInput
						className="border border-primary px-4 rounded-lg text-white"
						placeholder="Username"
						placeholderTextColor="#999"
						keyboardType="default"
						autoCapitalize="none"
						autoCorrect={false}
						value={form.username}
						onChangeText={(v) => setForm({ ...form, username: v })}
						editable={!isSubmitting}
					/>

					<View className="flex-row items-center border border-primary px-4 rounded-lg">
						<TextInput
							className="flex-1 text-white"
							placeholder="Password"
							placeholderTextColor="#999"
							value={form.password}
							secureTextEntry={!showPassword}
							autoCapitalize="none"
							autoCorrect={false}
							onChangeText={(v) =>
								setForm({ ...form, password: v })
							}
							editable={!isSubmitting}
							onSubmitEditing={handleLogin}
						/>

						<TouchableOpacity
							onPress={() => setShowPassword(!showPassword)}
							className=""
						>
							<AntDesign
								name={showPassword ? "eye-invisible" : "eye"}
								size={20}
								color="#cccccc"
							/>
						</TouchableOpacity>
					</View>
				</View>

				{error ? (
					<Text className="text-red-500 text-center mt-4 px-4">
						{error}
					</Text>
				) : null}

				<View className="mt-6 w-full max-w-xs">
					{isSubmitting ? (
						<ActivityIndicator size="large" color="#113CFC" />
					) : (
						<TouchableOpacity
							className="bg-primary py-3 px-6 rounded-lg items-center active:opacity-80"
							onPress={handleLogin}
							disabled={isSubmitting}
						>
							<Text className="text-white font-semibold text-base">
								Login
							</Text>
						</TouchableOpacity>
					)}
				</View>

				<View className="mt-8 flex-row gap-2 items-center">
					<Text className="text-white">Don't have an account?</Text>
					<Pressable
						onPress={() =>
							!isSubmitting && navigation.navigate("Register")
						}
						disabled={isSubmitting}
					>
						<Text className="text-primary font-bold">Sign Up</Text>
					</Pressable>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
