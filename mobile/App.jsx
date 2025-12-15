import AppNavigator from "./AppNavigator";
import { AuthProvider } from "./src/auth/AuthContext";
import { ImagePreviewProvider } from "./src/components/imagePreview";
import "./global.css";

export default function App() {
	return (
		<AuthProvider>
			<ImagePreviewProvider>
				<AppNavigator />
			</ImagePreviewProvider>
		</AuthProvider>
	);
}
