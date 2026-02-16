import { imageUpload } from "@/utils/authService";
import { FontAwesome } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, TouchableOpacity } from "react-native";

const CameraScreen: React.FC = () => {
	const openOptions = () => {
		Alert.alert("Select Option", "Choose source", [
			{ text: "Camera", onPress: openCamera },
			{ text: "Gallery", onPress: openGallery },
			{ text: "Pick PDF", onPress: pickPDF },
			{ text: "Cancel", style: "cancel" },
		]);
	};

	/* ---------------- COMMON UPLOAD HANDLER ---------------- */
	const uploadFile = async (
		uri: string,
		fileName: string,
		mimeType: string,
	) => {
		const formData = new FormData();

		formData.append("files", {
			uri,
			name: fileName,
			type: mimeType,
		} as any);

		try {
			const res = imageUpload(formData);
			console.log("Upload response:", res);
		} catch (error: any) {
			console.log("Status:", error?.response?.status);
			console.log("Backend error:", error?.response?.data);
			throw error;
		}
	};

	/* ---------------- CAMERA ---------------- */
	const openCamera = async () => {
		const permission = await ImagePicker.requestCameraPermissionsAsync();
		if (!permission.granted) {
			Alert.alert("Permission required");
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ["images"],
			quality: 0.5,
		});

		if (result.canceled) return;

		const asset = result.assets[0];

		console.log("Captured asset:", asset);

		await uploadFile(
			asset.uri,
			`photo_${Date.now()}.jpg`,
			asset.mimeType ?? "image/jpeg",
		);
	};

	/* ---------------- GALLERY ---------------- */
	const openGallery = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			Alert.alert("Gallery permission required");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			quality: 0.7,
		});

		if (result.canceled) return;

		const asset = result.assets[0];

		uploadFile(
			asset.uri,
			`gallery_${Date.now()}.jpg`,
			asset.mimeType || "image/jpeg",
		);
	};

	/* ---------------- PDF PICKER ---------------- */
	const pickPDF = async () => {
		const result = await DocumentPicker.getDocumentAsync({
			type: "application/pdf",
		});

		if (result.canceled) return;

		const asset = result.assets[0];

		uploadFile(
			asset.uri,
			asset.name || `document_${Date.now()}.pdf`,
			asset.mimeType || "application/pdf",
		);
	};

	return (
		<TouchableOpacity onPress={openOptions}>
			<FontAwesome name="camera" size={35} color="#999" />
		</TouchableOpacity>
	);
};

export default CameraScreen;
