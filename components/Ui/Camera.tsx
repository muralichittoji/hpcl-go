import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
	Alert,
	Image,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const CameraScreen: React.FC = () => {
	const [imageBase64, setImageBase64] = useState<string | null>(null);
	const [previewVisible, setPreviewVisible] = useState(false);

	const openCamera = async () => {
		try {
			// ✅ ask permission
			const permission = await ImagePicker.requestCameraPermissionsAsync();

			if (!permission.granted) {
				Alert.alert("Permission required", "Camera permission is required");
				return;
			}

			// ✅ launch camera
			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				cameraType: ImagePicker.CameraType.back,
				quality: 0.5,
				allowsEditing: false,
				base64: true,
			});

			// ❌ cancelled
			if (result.canceled) {
				Alert.alert("User cancelled camera picker");
				return;
			}

			// ✅ success
			const asset = result.assets[0];

			const base64 = asset.base64;
			const uri = asset.uri;

			if (!base64) return;

			console.log("URI:", uri);
			console.log("BASE64 length:", base64.length);

			// save for preview
			setImageBase64(`data:image/jpeg;base64,${base64}`);
			setPreviewVisible(true);

			// // small safe preview text only
			// Alert.alert(
			// 	"Captured ✅",
			// 	`Base64 (first 100 chars):\n${base64.slice(0, 100)}...`,
			// );
		} catch (err) {
			console.log(err);
			Alert.alert("Error", "Something went wrong opening camera");
		}
	};

	return (
		<>
			{/* Camera Button */}
			<TouchableOpacity onPress={openCamera}>
				<FontAwesome name="camera" size={35} color="#999" />
			</TouchableOpacity>

			{/* Preview Modal */}
			<Modal visible={previewVisible} transparent animationType="slide">
				<View style={styles.overlay}>
					<View style={styles.modalBox}>
						<Text style={styles.title}>Preview</Text>

						{imageBase64 && (
							<Image
								source={{ uri: imageBase64 }}
								style={styles.image}
								resizeMode="contain"
							/>
						)}

						<TouchableOpacity
							style={styles.closeBtn}
							onPress={() => setPreviewVisible(false)}
						>
							<Text style={{ color: "#fff" }}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
};

export default CameraScreen;

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalBox: {
		backgroundColor: "#fff",
		width: "90%",
		padding: 20,
		borderRadius: 16,
		alignItems: "center",
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 12,
	},
	image: {
		width: 250,
		height: 250,
		marginBottom: 20,
	},
	closeBtn: {
		backgroundColor: "#0369A1",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
});
