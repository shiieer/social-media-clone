import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export const UseAuth = () => {
	const context = useContext(AuthContext);

	if (context === undefined || context === null) {
		throw new Error("useAuth must be used within an AuthProvider. Make sure the component is wrapped with <AuthProvider>.");
	}

	return context;
};
