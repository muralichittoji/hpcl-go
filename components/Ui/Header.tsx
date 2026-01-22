import { ALL_IMAGES } from "@/hooks/Allimages";
import React from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from "react-native";
import { Colors } from "../../constants/theme";
const { width } = Dimensions.get("window");
const Header = ({
	caption,
	screen,
	subCaption,
}: {
	caption?: string;
	screen?: string;
	subCaption?: string;
}) => {
	const getStyle = (): ViewStyle => ({
		minHeight: screen === "Login" ? 180 : 120,
		height: "15%",
		display: "flex",
		flexDirection: screen ? "column" : "row",
		justifyContent: screen ? "center" : "flex-start",
		gap: 5,
		alignItems: "center",
		padding: 10,
		width: width - 20,
		margin: 10,
	});

	const getHeader = () => {
		switch (screen) {
			case "Login":
				return (
					<View style={styles.container}>
						<Image
							style={styles.headImage}
							source={ALL_IMAGES.MASTER_LOGO}
							resizeMode="contain"
						/>
						<View>
							<Text style={[styles.headText, { fontSize: 20 }]}>
								हिंदुस्तान पेट्रोलियम कॉर्पोरेशन लिमिटेड
							</Text>
							<Text style={[styles.headText, { fontSize: 16 }]}>
								Hindustan Petroleum Corporation Limited
							</Text>
							<Text
								style={[styles.headText, { fontSize: 20, fontWeight: "900" }]}
							>
								(A Maharatna Company)
							</Text>
						</View>
					</View>
				);
			default:
				return (
					<Image
						style={[{ width: "30%", height: 150 }]}
						source={ALL_IMAGES.MASTER_LOGO}
						resizeMode="contain"
					/>
				);
		}
	};

	return (
		<View style={getStyle()}>
			{getHeader()}
			<View style={{ width: "70%" }}>
				{caption && <Text style={[styles.content]}>{caption}</Text>}
				{subCaption && <Text style={styles.subTitle}>{subCaption}</Text>}
			</View>
			<View style={styles.divider} />
		</View>
	);
};

export default Header;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		padding: 5,
		marginTop: 30,
	},
	headImage: {
		width: "30%",
		height: 200,
		marginRight: 5,
	},
	content: {
		color: Colors.blueDark,
		fontSize: 30,
		fontWeight: "700",
	},
	subTitle: {
		fontSize: 14,
		color: Colors.grayDeep,
	},

	// logo: {
	//   height: scr,
	//   // margin: 10,
	// },
	headText: {
		color: Colors.blueDeep,
		fontSize: 15,
		fontWeight: "700",
	},
	divider: {
		height: 1,
		backgroundColor: "#000",
	},
});
