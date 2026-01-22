import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, TouchableOpacity } from "react-native";

const CameraScreen: React.FC = () => {
	const openCamera = async () => {
		// Request camera permission
		const permission = await ImagePicker.requestCameraPermissionsAsync();

		if (!permission.granted) {
			Alert.alert("Permission required", "Camera permission is required");
			return;
		}

		// Launch camera
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			cameraType: ImagePicker.CameraType.back,
			quality: 1,
			allowsEditing: false,
		});

		// Handle result
		if (result.canceled) {
			Alert.alert("User cancelled camera picker");
		} else {
			const uri = result.assets[0].uri;
			console.log("Captured Image URI:", uri);
			// upload / preview / save
		}
	};

	return (
		<TouchableOpacity onPress={openCamera}>
			<FontAwesome name="camera" size={35} color="#999" />
		</TouchableOpacity>
	);
};

export default CameraScreen;
