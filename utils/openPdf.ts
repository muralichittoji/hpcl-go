import { ALL_PDFS } from "@/hooks/ALL_PDFS";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export const openPdfFromRegistry = async (pdfKey: string) => {
	try {
		if (!pdfKey) {
			Alert.alert("Error", "PDF key not provided");
			return;
		}

		const pdfModule = ALL_PDFS[pdfKey];
		if (!pdfModule) {
			Alert.alert("Error", "PDF not found");
			return;
		}

		const fileUri = FileSystem.documentDirectory + `${pdfKey}.pdf`;

		const fileInfo = await FileSystem.getInfoAsync(fileUri);

		// Cache if not exists
		if (!fileInfo.exists) {
			const asset = Asset.fromModule(pdfModule);
			await asset.downloadAsync();

			const sourceUri = asset.localUri || asset.uri;

			await FileSystem.copyAsync({
				from: sourceUri,
				to: fileUri,
			});
		}

		if (!(await Sharing.isAvailableAsync())) {
			Alert.alert("Error", "No PDF viewer available");
			return;
		}

		await Sharing.shareAsync(fileUri, {
			mimeType: "application/pdf",
			UTI: "com.adobe.pdf",
		});
	} catch (error) {
		console.log("PDF open failed:", error);
		Alert.alert("Error", "Unable to open PDF file");
	}
};
