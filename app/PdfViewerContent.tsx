import { openPdfFromRegistry } from "@/utils/openPdf";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
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
			await openPdfFromRegistry(name);
		} catch (error) {
			console.log(error);
			Alert.alert("Error", "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			{/* Header */}
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
					<View style={styles.webLoader}>
						<ActivityIndicator size="large" color="#1e88e5" />
						<View style={{ height: 12 }} />
						<Text style={styles.loadingText}>Preparing document...</Text>
						<Text style={styles.subText}>Please wait a moment</Text>
					</View>
				)}
			/>

			{/* Share Loader Overlay */}
			{loading && (
				<View style={styles.loaderOverlay}>
					<ActivityIndicator size="large" color="#fff" />
					<View style={{ height: 12 }} />
					<Text style={styles.overlayText}>Preparing PDF for sharing...</Text>
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

	webLoader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f9fafb",
	},

	loadingText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#222",
	},

	subText: {
		fontSize: 13,
		color: "#666",
		marginTop: 4,
	},

	loaderOverlay: {
		position: "absolute",
		backgroundColor: "rgba(0,0,0,0.6)",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: "center",
		alignItems: "center",
	},

	overlayText: {
		marginTop: 10,
		color: "#fff",
		fontSize: 15,
		fontWeight: "500",
	},
});
