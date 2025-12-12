/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./App.{js,jsx,ts,tsx}",
		"./AppNavigator.{js,jsx,ts,tsx}",
		"./index.{js,jsx,ts,tsx}",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				primary: "#113CFC",
				secondary: "#161616",
				tertiary: "#313131",
				quaternary: "#1E1E1E",
				quinary: "#4163FD",
				dark: "#000000",
				white: "#ffffff",
				messagetext: "#909090",
			},
		},
	},
	plugins: [],
};
