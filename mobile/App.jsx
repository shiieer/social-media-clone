import AppNavigator from "./AppNavigator";
import { AuthProvider } from "./src/auth/AuthContext";
import "./global.css";

export default function App() {
	return (
		<AuthProvider>
			<AppNavigator />
		</AuthProvider>
	);
}
