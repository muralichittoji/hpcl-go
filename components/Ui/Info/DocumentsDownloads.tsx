import { ALL_PDFS } from "@/hooks/ALL_PDFS";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

/* ---------------- DATA ---------------- */

const documents = [{ title: "Material Safety Data Sheet (MSDS)", icon: "🛡️" }];

/* ---------------- COMPONENT ---------------- */

const DocumentsDownloads = ({ data }: any) => {
	const [loading, setLoading] = useState(false);

	/* ---------------- OPEN MSDS PDF ---------------- */

	const openMsdsPdf = async () => {
		try {
			if (!data?.MSDS) {
				router.push("/SampleData");
				return;
			}

			const pdfModule = ALL_PDFS[data.MSDS];
			if (!pdfModule) {
				router.push("/SampleData");
				return;
			}

			setLoading(true);

			const fileUri = FileSystem.documentDirectory + `${data.MSDS}.pdf`;

			// ✅ Use cached file if already exists
			const fileInfo = await FileSystem.getInfoAsync(fileUri);
			if (!fileInfo.exists) {
				const asset = Asset.fromModule(pdfModule);
				await asset.downloadAsync();

				await FileSystem.copyAsync({
					from: asset.localUri!,
					to: fileUri,
				});
			}

			// ✅ Open using native viewer (iOS & Android)
			await Sharing.shareAsync(fileUri, {
				mimeType: "application/pdf",
				UTI: "com.adobe.pdf", // iOS safe
			});
		} catch (error) {
			console.log("MSDS open failed:", error);
			Alert.alert("Error", "Unable to open MSDS file");
		} finally {
			setLoading(false);
		}
	};

	/* ---------------- CLICK HANDLER ---------------- */

	const onDocumentPress = async (title: string) => {
		if (title === "Material Safety Data Sheet (MSDS)") {
			await openMsdsPdf();
			return;
		}

		router.push("/SampleData");
	};

	/* ---------------- UI ---------------- */

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerIcon}>📁</Text>
				<Text style={styles.headerText}>Documents & Downloads</Text>
			</View>

			{/* Loader */}
			{loading && (
				<ActivityIndicator size="large" style={{ marginVertical: 20 }} />
			)}

			{/* Documents list */}
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

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#F0F9FF",
		padding: 16,
		borderRadius: 18,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	headerIcon: { fontSize: 22, marginRight: 8 },
	headerText: {
		fontSize: 18,
		fontWeight: "700",
		color: "#0F172A",
	},
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
	iconText: { fontSize: 16, color: "#FFFFFF" },
	itemText: {
		fontSize: 15,
		fontWeight: "600",
		color: "#0F172A",
		flex: 1,
	},
});
