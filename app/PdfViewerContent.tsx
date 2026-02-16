import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { WebView } from "react-native-webview";

type Props = {
	pdfUrl: string;
	name: string;
	onClose?: () => void;
};

export default function PdfViewerContent({ pdfUrl, name, onClose }: Props) {
	const [loading, setLoading] = useState(false);

	const sharePdf = async () => {
		try {
			setLoading(true);

			const fileUri = FileSystem.documentDirectory + `${name}_MSDS.pdf`;

			const downloadResumable = FileSystem.createDownloadResumable(
				pdfUrl,
				fileUri,
			);

			const result = await downloadResumable.downloadAsync();

			if (!result) {
				Alert.alert("Error", "Download failed");
				return;
			}

			if (!(await Sharing.isAvailableAsync())) {
				Alert.alert("Error", "Sharing not available");
				return;
			}

			await Sharing.shareAsync(result.uri, {
				mimeType: "application/pdf",
				UTI: "com.adobe.pdf",
			});
		} catch (error) {
			console.log(error);
			Alert.alert("Error", "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			{/* Header inside sheet */}
			<View style={styles.header}>
				<TouchableOpacity onPress={onClose}>
					<Ionicons name="close" size={24} />
				</TouchableOpacity>

				<TouchableOpacity onPress={sharePdf}>
					<Ionicons name="share-outline" size={24} />
				</TouchableOpacity>
			</View>

			{/* PDF Viewer */}
			<WebView
				source={{ uri: pdfUrl }}
				style={{ flex: 1 }}
				startInLoadingState
				scalesPageToFit
				setBuiltInZoomControls={true}
				setDisplayZoomControls={false}
				androidLayerType="hardware"
				renderLoading={() => (
					<ActivityIndicator size="large" style={{ marginTop: 20 }} />
				)}
			/>

			{loading && (
				<View style={styles.loaderOverlay}>
					<ActivityIndicator size="large" color="#fff" />
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		padding: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#fff",
	},
	loaderOverlay: {
		position: "absolute",
		backgroundColor: "rgba(0,0,0,0.5)",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: "center",
		alignItems: "center",
	},
});
