import { createContext, useContext, useState } from "react";

const ImagePreviewContext = createContext();

export const useImagePreview = () => {
	const context = useContext(ImagePreviewContext);
	if (!context) {
		throw new Error("useImagePreview must be used within ImagePreviewProvider");
	}
	return context;
};

export const ImagePreviewProvider = ({ children }) => {
	const [previewVisible, setPreviewVisible] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [profileImage, setProfileImage] = useState(null);
	const [username, setUsername] = useState(null);

	const openPreview = (image, profileImg = null, user = null) => {
		setSelectedImage(image);
		setProfileImage(profileImg);
		setUsername(user);
		setPreviewVisible(true);
	};

	const closePreview = () => {
		setPreviewVisible(false);
		setSelectedImage(null);
		setProfileImage(null);
		setUsername(null);
	};

	return (
		<ImagePreviewContext.Provider
			value={{
				previewVisible,
				selectedImage,
				profileImage,
				username,
				openPreview,
				closePreview,
			}}
		>
			{children}
		</ImagePreviewContext.Provider>
	);
};

