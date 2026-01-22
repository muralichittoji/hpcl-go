import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type PackagingSupplyProps = {
	data?: string[];
};

const PackagingSupply = ({ data = [] }: PackagingSupplyProps) => {
	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.appView}>
				<Text style={styles.content}>Packaging {"\n"} & Supply</Text>
			</View>

			<View style={styles.dividerGreen} />

			<View style={styles.mapContainer}>
				{data.map((item, index) => (
					<Text key={index} style={styles.itemText}>
						{item}
					</Text>
				))}
			</View>
		</View>
	);
};

export default PackagingSupply;

const styles = StyleSheet.create({
	container: {
		minHeight: 150,
	},
	appView: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
	},

	content: {
		textAlign: "center",
		color: Colors.blueDark,
		fontSize: 25,
		fontWeight: "700",
	},

	dividerGreen: {
		backgroundColor: Colors.greenDark,
		height: 2,
		marginVertical: 10,
	},

	mapContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
		gap: 10,
		paddingHorizontal: 10,
	},

	itemText: {
		fontSize: 16,
		fontWeight: "600",
		color: Colors.black,
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: Colors.greenLight,
		borderRadius: 6,
	},
});
