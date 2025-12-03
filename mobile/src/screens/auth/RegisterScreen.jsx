import React, { useState } from "react";
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
import { register } from "../../api/auth/AuthApi";

export default function RegisterScreen({ navigation }) {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		password2: "",
	});
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);

	const handleRegister = async () => {
		setError("");
		setIsSubmitting(true);

		const username = form.username.trim();
		const email = form.email.trim();
		const password = form.password;
		const password2 = form.password2;

		if (!username || !email || !password || !password2) {
			setError("Please fill all fields");
			setIsSubmitting(false);
			return;
		}

		if (password !== password2) {
			setError("Passwords do not match");
			setIsSubmitting(false);
			return;
		}

		console.log("Sending register data:", form);

		try {
			const res = await register({
				username,
				email,
				password,
				password2,
			});

			if (res.id || res.username) {
				setIsSubmitting(false);
				Alert.alert("Success", "Registration successful!", [
					{
						text: "OK",
						onPress: () => {
							// Use setTimeout to avoid render phase update
							setTimeout(() => {
								navigation.navigate("Login");
							}, 0);
						},
					},
				]);
			} else {
				const errorMessage =
					typeof res === "string"
						? res
						: res?.error || JSON.stringify(res);
				setError(errorMessage);
				Alert.alert("Registration failed", errorMessage);
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error("Register error:", error);
			const errorMessage =
				error?.message || "Registration failed. Please try again.";
			setError(errorMessage);
			Alert.alert("Error", errorMessage);
			setIsSubmitting(false);
		}
	};

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
					Register
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

					<TextInput
						className="border border-primary px-4 rounded-lg text-white"
						placeholder="Email"
						placeholderTextColor="#999"
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
						value={form.email}
						onChangeText={(v) => setForm({ ...form, email: v })}
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

					<View className="flex-row items-center border border-primary px-4 rounded-lg">
						<TextInput
							className="flex-1 text-white"
							placeholder="Confirm Password"
							placeholderTextColor="#999"
							value={form.password2}
							secureTextEntry={!showPassword2}
							autoCapitalize="none"
							autoCorrect={false}
							onChangeText={(v) =>
								setForm({ ...form, password2: v })
							}
							editable={!isSubmitting}
							onSubmitEditing={handleRegister}
						/>

						<TouchableOpacity
							onPress={() => setShowPassword2(!showPassword2)}
							className=""
						>
							<AntDesign
								name={showPassword2 ? "eye-invisible" : "eye"}
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
							onPress={handleRegister}
							disabled={isSubmitting}
						>
							<Text className="text-white font-semibold text-base">
								Register
							</Text>
						</TouchableOpacity>
					)}
				</View>

				<View className="mt-8 flex-row gap-2 items-center">
					<Text className="text-white">Have an account?</Text>
					<Pressable
						onPress={() =>
							!isSubmitting && navigation.navigate("Login")
						}
						disabled={isSubmitting}
					>
						<Text className="text-primary font-bold">Login</Text>
					</Pressable>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
