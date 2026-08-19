import { ALL_IMAGES } from "@/hooks/Allimages";
import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface FooterProps {
	screen?: string;
	height?: number;
}

const Footer: React.FC<FooterProps> = ({ screen }) => {
	return (
		<SafeAreaView
			edges={
				screen === "welcome" ? ["left", "right"] : ["bottom", "left", "right"]
			}
			style={styles.footerSafeArea}
		>
			<View style={styles.footerContainer}>
				<Image
					style={[styles.footerImage]}
					source={ALL_IMAGES.MASTER_FOOTER_TRUSTED2}
					resizeMode="contain"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Footer;

const styles = StyleSheet.create({
	footerSafeArea: {
		width: "100%",
		backgroundColor: "#fff",
	},
	footerContainer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	footerImage: {
		width: width - 35,
		height: 100,
	},
});
