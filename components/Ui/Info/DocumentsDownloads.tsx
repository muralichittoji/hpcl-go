import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

const documents = [
	// { title: "Product Data Sheet (PDS)", icon: "📄" },
	{ title: "Material Safety Data Sheet (MSDS)", icon: "🛡️" },
	// { title: "Brochure", icon: "📘" },
];

const DocumentsDownloads = ({ data }: any) => {
	const [openPdf, setOpenPdf] = useState(false);

	const onDocumentPress = (title: string) => {
		switch (title) {
			case "Material Safety Data Sheet (MSDS)":
				if (data === "E20 MS") {
					setOpenPdf(true);
				} else router.push("/SampleData");
				break;

			default:
				router.push("/SampleData");
				break;
		}
	};

	const closeModal = () => {
		setOpenPdf(false);
	};

	const url =
		"https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvYy82ZmRlYzFmMDVkZDRlYzA1L0lRRGZYYTFOdnFDT1NhTVBNOWQ0Wlh5MUFaQTJNYnNkaUc0V3FVRXdIT2tXM3lVP2U9MmtwaDNX&cid=6FDEC1F05DD4EC05&id=6FDEC1F05DD4EC05%21s4dad5ddfa0be498ea30f33d778657cb5&parId=6FDEC1F05DD4EC05%21105&o=OneUp";

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerIcon}>📁</Text>
				<Text style={styles.headerText}>Documents & Downloads</Text>
			</View>

			{openPdf && (
				<View style={{ height: "70%" }}>
					<Modal
						visible={openPdf}
						animationType="slide"
						onRequestClose={closeModal}
					>
						<View style={{ flex: 1 }}>
							<TouchableOpacity onPress={closeModal} style={styles.closeButton}>
								<Text style={styles.closeText}>X</Text>
							</TouchableOpacity>

							<WebView
								source={{ uri: url }}
								javaScriptEnabled
								domStorageEnabled
								startInLoadingState
								style={{ flex: 1 }}
							/>
						</View>
					</Modal>
				</View>
			)}

			{/* List */}
			{documents.map((item, index) => (
				<TouchableOpacity
					key={index}
					style={styles.item}
					onPress={() => onDocumentPress(item.title)}
				>
					<View style={styles.itemIcon}>
						<Text style={styles.iconText}>{item.icon}</Text>
					</View>
					<Text style={styles.itemText}>{item.title}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

export default DocumentsDownloads;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#F0F9FF",
		padding: 16,
		borderRadius: 18,
	},

	closeButton: {
		position: "absolute",
		top: 45, // safe for status bar
		right: 16,
		zIndex: 10,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "rgba(0,0,0,0.6)",
		justifyContent: "center",
		alignItems: "center",
	},

	closeText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "700",
	},

	/* Header */
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},

	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "90%",
		height: "80%",
		backgroundColor: "white",
		borderRadius: 10,
		overflow: "hidden",
	},

	headerIcon: {
		fontSize: 22,
		marginRight: 8,
	},

	headerText: {
		fontSize: 18,
		fontWeight: "700",
		color: "#0F172A",
	},

	/* Items */
	item: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#DBEAFE",
		padding: 14,
		borderRadius: 14,
		marginBottom: 10,
	},

	itemIcon: {
		width: 36,
		height: 36,
		borderRadius: 10,
		backgroundColor: "#2563EB",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},

	iconText: {
		fontSize: 16,
		color: "#FFFFFF",
	},

	itemText: {
		fontSize: 15,
		fontWeight: "600",
		color: "#0F172A",
		flex: 1,
	},
});
