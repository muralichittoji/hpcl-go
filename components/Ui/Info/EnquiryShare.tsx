import React from "react";
import {
	Alert,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";

import { Colors } from "@/constants/theme";
import * as MailComposer from "expo-mail-composer";
import { shareAsPDF } from "./ShareAsPdf";

// ✅ Correct Expo image imports
const ShareIcon = require("@/assets/images/icons/share.png");
const MessageIcon = require("@/assets/images/icons/email.png");
const EnquireIcon = require("@/assets/images/icons/share.png");

const EnquiryShare = ({ data, openEnquire }: any) => {
	const Enquiry = [
		{
			id: 1,
			title: "Enquire \nNow",
			icon: EnquireIcon,
			colors: Colors.blueBright,
		},
		{
			id: 2,
			title: "E-Mail",
			icon: MessageIcon,
			colors: Colors.greenBright,
		},
		{
			id: 3,
			title: "Share",
			icon: ShareIcon,
			colors: Colors.pink,
		},
	];

	const openEmail = async () => {
		const available = await MailComposer.isAvailableAsync();

		if (!available) {
			Alert.alert(
				"Email not available",
				"Please configure an email app to send mail.",
			);
			return;
		}

		await MailComposer.composeAsync({
			recipients: ["customercare@hpcl.com"],
			subject: `Enquiry about ${data.title}`, // ✅ dynamic subject
			body: `Hello HPCL Team,\n\nI would like to know more about ${data.title}.\n\nThanks.`,
		});
	};

	// const shareAsPDF = async () => {
	// 	try {
	// 		if (!data) {
	// 			throw new Error("No product data");
	// 		}

	// 		const html = await PDFShare(data);

	// 		const { uri } = await Print.printToFileAsync({
	// 			html,
	// 		});

	// 		await Sharing.shareAsync(uri, {
	// 			mimeType: "application/pdf",
	// 			dialogTitle: `HPCL_${data?.title ?? "Product"}`,
	// 		});
	// 	} catch (error) {
	// 		console.error("PDF Share Error:", error);
	// 		Alert.alert(
	// 			"Unable to share PDF",
	// 			"Something went wrong while preparing the document."
	// 		);
	// 	}
	// };

	const handleAction = async (title: string) => {
		switch (title) {
			case "Share":
				await shareAsPDF(data);
				break;

			case "E-Mail":
				await openEmail();
				break;

			case "Enquire \nNow":
				openEnquire(true);
				break;

			default:
				break;
		}
	};

	return (
		<View>
			<View style={styles.dividerGreen} />

			<View style={styles.mapContainer}>
				{Enquiry.map((item) => (
					<TouchableOpacity
						key={item.id}
						style={[styles.appBtn, { backgroundColor: item.colors }]}
						onPress={() => handleAction(item.title)}
					>
						{item.title !== "Enquire \nNow" ? (
							<Image source={item.icon} style={styles.icon} />
						) : (
							<FontAwesome
								name="comment"
								size={50}
								// style={styles.icon}
								color="#fff"
							/>
						)}

						<Text style={styles.appText}>{item.title}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

export default EnquiryShare;

const styles = StyleSheet.create({
	icon: {
		height: 60,
		width: 60,
		borderRadius: 10,
		marginBottom: 6,
	},

	appBtn: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 10,
		padding: 10,
		width: "30%",
		borderRadius: 10,
	},

	appText: {
		color: "#fff",
		textAlign: "center",
		fontSize: 16,
		fontWeight: "600",
	},

	dividerGreen: {
		backgroundColor: Colors.greenDark,
		height: 2,
		marginVertical: 10,
	},

	mapContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginVertical: 10,
	},
});
