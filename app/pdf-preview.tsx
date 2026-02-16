import { File } from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

export default function PDFPreview() {
	const { uri } = useLocalSearchParams();
	const [base64, setBase64] = useState<string | null>(null);

	useEffect(() => {
		const loadPDF = async () => {
			if (!uri) return;

			const file = new File(uri as string);

			const base64 = await file.base64();

			setBase64(base64);
		};

		loadPDF();
	}, []);

	const handleShare = async () => {
		if (!uri) return;

		await Sharing.shareAsync(uri as string, {
			mimeType: "application/pdf",
		});
	};

	if (!base64) return null;

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<Text style={styles.close}>Close</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={handleShare}>
					<Text style={styles.share}>Share</Text>
				</TouchableOpacity>
			</View>

			<WebView
				originWhitelist={["*"]}
				source={{
					html: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
              background-color: #ffffff;
            }
            embed {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <embed 
            src="data:application/pdf;base64,${base64}" 
            type="application/pdf"
          />
        </body>
      </html>
    `,
				}}
				style={{ flex: 1 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#fff", marginTop: 40 },
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 15,
		borderBottomWidth: 1,
		borderColor: "#eee",
	},
	close: { color: "red", fontSize: 16 },
	share: { color: "#007AFF", fontSize: 16 },
});
