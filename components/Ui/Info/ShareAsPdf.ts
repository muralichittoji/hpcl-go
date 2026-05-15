// import * as Print from 'expo-print';
// import * as Sharing from 'expo-sharing';
// import { Alert } from 'react-native';
// import { PDFShare } from './PDFShare';

// export const shareAsPDF = async (data: any) => {
// 	try {
// 		if (!data) {
// 			throw new Error('No product data');
// 		}
// 		const html = await PDFShare(data);
// 		const { uri } = await Print.printToFileAsync({ html, base64: false });
// 		await Sharing.shareAsync(uri);
// 	} catch (error) {
// 		console.error('PDF Share Error:', error);
// 		Alert.alert(
// 			'Unable to share PDF',
// 			'Something went wrong while preparing the document.'
// 		);
// 	}
// };

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { PDFShare } from "./PDFShare";

export const shareAsPDF = async (data: any) => {
	const isComparison = data.specifications?.[0]?.property === "Comparision";

	const pageOrientation = isComparison ? "landscape" : "portrait";

	// pass orientation into HTML generator
	const html = await PDFShare(data, pageOrientation);

	const { uri } = await Print.printToFileAsync({
		html,
	});

	console.log("PDF URI:", uri);

	await Sharing.shareAsync(uri, {
		mimeType: "application/pdf",
		dialogTitle: "Share PDF",
	});
};
