import { Colors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
const RoadIcon = "@/assets/images/icons/road-construction.png";

const RelatedProducts = ({ Packages }: any) => {
	return (
		<View>
			{/* Header */}
			<View style={styles.appView}>
				<Image source={require(RoadIcon)} style={styles.icon} />
				<Text style={styles.content}>Related Products</Text>
			</View>

			<View style={styles.dividerGreen} />
			<View style={styles.mapContainer}>
				{Packages?.map((item: any, index: number) => (
					<Text style={styles.appText} key={`${item}-${index}`}>
						{item}
						{index < Packages.length - 1 ? "," : ""}
					</Text>
				))}
			</View>
		</View>
	);
};

export default RelatedProducts;

const styles = StyleSheet.create({
	icon: {
		height: 70,
		width: 70,
		padding: 10,
		borderRadius: 10,
		backgroundColor: Colors.blueDark,
	},

	appView: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
		marginVertical: 10,
		marginTop: 20,
		gap: 20,
	},

	appText: {
		color: "black",
		fontSize: 20,
		fontWeight: "700",
	},

	dividerGreen: {
		backgroundColor: Colors.greenDark,
		height: 2,
		marginVertical: 10,
	},

	content: {
		textAlign: "center",
		color: Colors.blueDark,
		fontSize: 25,
		fontWeight: "700",
	},

	mapContainer: {
		flexDirection: "row",
		// justifyContent: 'space-around',
		// alignItems: 'center',
		gap: 10,
		marginVertical: 10,
	},
});
