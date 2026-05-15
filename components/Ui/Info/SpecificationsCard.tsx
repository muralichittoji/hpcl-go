import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const SpecificationsCard = ({ data }: any) => {
	const [modalVisible, setModalVisible] = useState(false);

	// Show only the first 4 items
	const previewData = data.slice(0, 4);

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.iconCircle}>
					<Text style={styles.icon}>▦</Text>
				</View>
				<Text style={styles.headerText}>Specifications</Text>
			</View>

			{/* Table */}
			<View style={styles.table}>
				{/* Table Header */}
				<View style={[styles.row, styles.headerRow]}>
					<Text style={[styles.cell, styles.headerCell]}>Property</Text>
					<Text style={[styles.cell, styles.headerCell]}>Value</Text>
				</View>

				{/* Table Rows */}
				{previewData.map((item: any, index: number) => (
					<View key={index} style={styles.row}>
						<Text style={styles.cell}>{item.property}</Text>
						<Text style={styles.cellValue}>{item.value}</Text>
					</View>
				))}
			</View>

			{/* View More Button */}
			{data.length > 4 && (
				<TouchableOpacity
					onPress={() => setModalVisible(true)}
					style={styles.viewMoreButton}
				>
					<Text style={styles.viewMoreText}>View More...</Text>
				</TouchableOpacity>
			)}

			{/* Modal */}
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<ScrollView>
							{/* Table Header */}
							<View style={[styles.row, styles.headerRow]}>
								<Text style={[styles.cell, styles.headerCell]}>Property</Text>
								<Text style={[styles.cell, styles.headerCell]}>Value</Text>
							</View>

							{/* Table Rows */}
							{data.map((item: any, index: number) => (
								<View key={index} style={styles.row}>
									<Text style={styles.cell}>{item.property}</Text>
									<Text style={styles.cellValue}>{item.value}</Text>
								</View>
							))}

							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								style={[styles.closeButton]}
							>
								<Text style={styles.viewMoreText}>Close</Text>
							</TouchableOpacity>
						</ScrollView>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default SpecificationsCard;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		padding: 16,
		borderRadius: 16,
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
		color: "#0369A1",
		fontWeight: "700",
		textAlign: "center",
	},

	headerText: {
		textAlign: "center",
		color: Colors.blueDark,
		fontSize: 25,
		fontWeight: "700",
	},

	/* Table */
	table: {
		borderRadius: 12,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "#DBEAFE",
	},

	row: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#DBEAFE",
	},

	headerRow: {
		backgroundColor: "#F0F9FF",
	},

	cell: {
		flex: 1,
		padding: 12,
		fontSize: 14,
		color: "#0F172A",
	},

	headerCell: {
		fontWeight: "700",
	},

	cellValue: {
		flex: 1,
		padding: 12,
		fontSize: 14,
		fontWeight: "600",
		color: "#0F172A",
	},

	/* View More Button */
	viewMoreButton: {
		marginTop: 8,
		padding: 8,
		// backgroundColor: '#E0F2FE',
		borderRadius: 8,
		alignSelf: "flex-start",
	},
	closeButton: {
		padding: 10,
		backgroundColor: "#E0F2FE",
		marginTop: 10,
		borderRadius: 8,
		alignSelf: "center",
	},

	viewMoreText: {
		color: "#0369A1",
		fontWeight: "600",
		fontSize: 16,
	},

	/* Modal */
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		padding: 16,
	},

	modalContent: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		maxHeight: "80%",
	},
});
