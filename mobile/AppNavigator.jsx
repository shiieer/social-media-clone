import React, { useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useContext } from "react";
import { AuthContext } from "./src/auth/AuthContext";

import HomeScreen from "./src/screens/home/HomeScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";

import "./global.css";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
	const { user, initializing } = useContext(AuthContext);

	// Memoize screens to prevent render phase updates
	const screens = useMemo(() => {
		if (user) {
			return <Stack.Screen name="Home" component={HomeScreen} />;
		}
		return (
			<>
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Register" component={RegisterScreen} />
			</>
		);
	}, [user]);

	if (initializing) {
		return null;
	}

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{screens}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
