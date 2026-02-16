import { ALL_PDFS } from "@/hooks/ALL_PDFS";
import { router } from "expo-router";
import React from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const documents = [{ title: "Material Safety Data Sheet (MSDS)", icon: "🛡️" }];

type Props = {
	data: any;
	loading: boolean;
	setOpenPdf: React.Dispatch<React.SetStateAction<boolean>>;
	setPdfUrl: React.Dispatch<React.SetStateAction<string>>;
	setPdfName: React.Dispatch<React.SetStateAction<string>>;
};

const DocumentsDownloads = ({
	data,
	loading,
	setOpenPdf,
	setPdfUrl,
	setPdfName,
}: Props) => {
	const pdfUrl = ALL_PDFS[data?.MSDS ?? ""];
	const pdfName = data?.title ?? "Document";

	const openMsdsPdf = () => {
		if (!data?.MSDS) return router.push("/(tabs)/SampleData");

		setPdfUrl(pdfUrl);
		setPdfName(pdfName);
		setOpenPdf(true);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerIcon}>📁</Text>
				<Text style={styles.headerText}>Documents & Downloads</Text>
			</View>

			{loading && (
				<ActivityIndicator size="large" style={{ marginVertical: 20 }} />
			)}

			{documents.map((item, index) => (
				<TouchableOpacity key={index} style={styles.item} onPress={openMsdsPdf}>
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
		flex: 1,
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
