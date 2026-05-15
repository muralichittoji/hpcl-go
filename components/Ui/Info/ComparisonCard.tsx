import comparisonData from "@/constants/Jsons/specificationData.json";
import { Colors } from "@/constants/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
	value: string;
};

const ComparisonCard: React.FC<Props> = ({ value }) => {
	const item = comparisonData[value as keyof typeof comparisonData];

	if (!item?.comparison) {
		return (
			<View style={styles.header}>
				<View style={styles.iconCircle}>
					<Text style={styles.icon}>▦</Text>
				</View>
				<Text style={styles.headerText}>
					Specification &{"\n"} Comparison{value}
				</Text>
			</View>
		);
	}
	const { headers, rows } = item?.comparison;

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.iconCircle}>
					<Text style={styles.icon}>▦</Text>
				</View>
				<Text style={styles.headerText}>Specification &{"\n"} Comparison</Text>
			</View>

			{/* horizontal scroll for many columns */}
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View>
					{/* HEADER ROW */}
					<View style={[styles.row, styles.headerRow]}>
						{headers.map((head, i) => (
							<Text
								key={i}
								style={[
									styles.cell,
									styles.headerCell,
									i === 0 && styles.propertyCell,
								]}
							>
								{head}
							</Text>
						))}
					</View>

					{/* DATA ROWS */}
					{rows.map((row, rIndex) => (
						<View key={rIndex} style={styles.row}>
							{row.map((col, cIndex) => (
								<Text
									key={cIndex}
									style={[
										styles.cell,
										cIndex === 0 && styles.propertyCell, // first column bold
									]}
								>
									{col}
								</Text>
							))}
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

export default ComparisonCard;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		padding: 16,
		borderRadius: 16,
	},

	title: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 12,
	},

	/* ROW */
	row: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#E2E8F0",
		alignItems: "stretch",
	},

	headerRow: {
		backgroundColor: "#E0F2FE",
	},

	/* Header */
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
		gap: 10,
	},

	iconCircle: {
		width: 65,
		height: 65,
		borderRadius: 20,
		backgroundColor: "#E0F2FE",
		justifyContent: "center",
		alignItems: "center",
	},

	icon: {
		fontSize: 45,
		color: Colors.blueBright,
		fontWeight: "700",
		textAlign: "center",
	},

	headerText: {
		textAlign: "justify",
		color: Colors.blueDark,
		fontSize: 25,
		fontWeight: "700",
	},

	/* CELLS */
	cell: {
		width: 125,
		paddingVertical: 12,
		paddingHorizontal: 8,
		fontSize: 13,
		color: "#0F172A",
		textAlign: "center",
		textAlignVertical: "center",
	},

	headerCell: {
		fontWeight: "700",
	},

	/* first column bigger */
	propertyCell: {
		width: 125,
		fontWeight: "600",
		textAlign: "left",
	},
});
