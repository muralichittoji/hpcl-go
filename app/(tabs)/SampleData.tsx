import Header from "@/components/Ui/Header";
import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import React from "react";
import { Image, Linking, StyleSheet, Text, View } from "react-native";

const SampleData = () => {
	return (
		<View style={styles.container}>
			<Header caption="" screen="Login" />
			<View
				style={{
					flex: 1 / 2,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text
					style={{
						textAlign: "center",
						fontSize: 30,
						fontWeight: "500",
						marginBottom: 20,
						color: Colors.orangeDeep,
					}}
				>
					This sheet is not available for download.
				</Text>
				<Text
					style={{
						textAlign: "center",
						fontSize: 30,
						fontWeight: "500",
					}}
				>
					Please reach us @{" "}
					<Text
						style={{
							color: Colors.blueLight,
							textDecorationLine: "underline",
						}}
						onPress={() => Linking.openURL("mailto:productsupport@hpcl.in")}
					>
						productsupport@hpcl.in
					</Text>{" "}
					and our team will be happy to assist you with the necessary details
				</Text>
			</View>
			<Image source={ALL_IMAGES.HAPPINESS_ICON} style={styles.happiness} />
		</View>
	);
};

export default SampleData;

const styles = StyleSheet.create({
	container: {
		height: "100%",
		justifyContent: "space-between",
	},
	happiness: {
		height: 100,
		width: 130,
		alignSelf: "flex-end",
		marginRight: 20,
	},
});
