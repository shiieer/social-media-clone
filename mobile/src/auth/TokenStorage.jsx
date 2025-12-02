// src/auth/TokenStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

class TokenStorage {
	constructor() {
		this.storage = Platform.OS === "web" ? AsyncStorage : SecureStore;
		this.keys = {
			ACCESS: "access",
			REFRESH: "refresh",
		};
	}

	async setItem(key, value) {
		try {
			if (Platform.OS === "web") {
				return await AsyncStorage.setItem(key, value);
			}
			return await SecureStore.setItemAsync(key, value);
		} catch (error) {
			console.error(`TokenStorage: Error saving ${key}`, error);
			throw error;
		}
	}

	async getItem(key) {
		try {
			if (Platform.OS === "web") {
				return await AsyncStorage.getItem(key);
			}
			return await SecureStore.getItemAsync(key);
		} catch (error) {
			console.error(`TokenStorage: Error reading ${key}`, error);
			return null;
		}
	}

	async removeItem(key) {
		try {
			if (Platform.OS === "web") {
				return await AsyncStorage.removeItem(key);
			}
			return await SecureStore.deleteItemAsync(key);
		} catch (error) {
			console.error(`TokenStorage: Error removing ${key}`, error);
			throw error;
		}
	}

	async saveTokens(access, refresh) {
		await Promise.all([
			this.setItem(this.keys.ACCESS, access),
			this.setItem(this.keys.REFRESH, refresh),
		]);
	}

	async getAccessToken() {
		return this.getItem(this.keys.ACCESS);
	}

	async getRefreshToken() {
		return this.getItem(this.keys.REFRESH);
	}

	async clearTokens() {
		await Promise.all([
			this.removeItem(this.keys.ACCESS),
			this.removeItem(this.keys.REFRESH),
		]);
	}

	async hasTokens() {
		const [access, refresh] = await Promise.all([
			this.getAccessToken(),
			this.getRefreshToken(),
		]);
		return !!(access && refresh);
	}
}

// Export a singleton instance
export const tokenStorage = new TokenStorage();

// Or export the class for testing
export default TokenStorage;
