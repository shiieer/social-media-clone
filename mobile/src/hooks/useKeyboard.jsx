import { useState, useEffect } from "react";
import { Keyboard, Platform } from "react-native";

export function useKeyboard() {
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		const keyboardWillShowListener = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
			(e) => {
				setKeyboardHeight(e.endCoordinates.height);
			}
		);

		const keyboardWillHideListener = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
			() => {
				setKeyboardHeight(0);
			}
		);

		return () => {
			keyboardWillShowListener.remove();
			keyboardWillHideListener.remove();
		};
	}, []);

	return keyboardHeight;
}

