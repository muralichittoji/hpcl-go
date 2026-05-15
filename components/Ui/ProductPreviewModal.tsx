import comparisonData from "@/constants/Jsons/specificationData.json";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { shareAsPDF } from "./Info/ShareAsPdf";

type Props = {
	visible: boolean;
	product: any;
	onClose: () => void;
};

const safeValue = (val: any) =>
	val === null || val === undefined || val === "" ? "-" : String(val);

export default function ProductPreviewModal({
	visible,
	product,
	onClose,
}: Props) {
	if (!product) return null;

	/* ---------------- SHARE HANDLER ---------------- */
	const handleShare = async () => {
		await shareAsPDF(product);
	};

	/* ---------------- DETECT COMPARISON ---------------- */
	const isComparison = product.specifications?.[0]?.property === "Comparision";

	const comparisonKey = product.specifications?.[0]?.value;

	const comparisonItem =
		comparisonKey &&
		comparisonData[comparisonKey as keyof typeof comparisonData];

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					{/* HEADER */}
					<View style={styles.header}>
						<TouchableOpacity onPress={onClose}>
							<Text style={styles.close}>Close</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
							<Ionicons
								name="share-outline"
								size={18}
								color="#007AFF"
								style={{
									marginRight: 6,
								}}
							/>

							<Text style={styles.share}>Share</Text>
						</TouchableOpacity>
					</View>

					{/* CONTENT */}
					<ScrollView contentContainerStyle={styles.content}>
						{/* TITLE */}
						<Text style={styles.title}>{safeValue(product.title)}</Text>

						<Text style={styles.subtitle}>{safeValue(product.subTitle)}</Text>

						{/* DESCRIPTION */}
						<Text style={styles.section}>Description</Text>

						<Text style={styles.text}>{safeValue(product.description)}</Text>

						{/* SPECIFICATIONS */}
						<Text style={styles.section}>Specifications</Text>

						{isComparison && comparisonItem?.comparison ? (
							/* COMPARISON TABLE */
							<ScrollView horizontal>
								<View style={styles.table}>
									{/* HEADER ROW */}
									<View style={[styles.row, styles.headerRow]}>
										{comparisonItem.comparison.headers.map(
											(header: string, index: number) => (
												<Text
													key={index}
													style={[
														styles.compareHeaderCell,
														index === 0 && styles.comparePropertyCell,
													]}
												>
													{safeValue(header)}
												</Text>
											),
										)}
									</View>

									{/* DATA ROWS */}
									{comparisonItem.comparison.rows.map(
										(row: string[], rowIndex: number) => (
											<View key={rowIndex} style={styles.row}>
												{row.map((col: string, colIndex: number) => (
													<Text
														key={colIndex}
														style={[
															styles.compareCell,
															colIndex === 0 && styles.comparePropertyCell,
														]}
														numberOfLines={colIndex === 0 ? 2 : 1}
													>
														{safeValue(col)}
													</Text>
												))}
											</View>
										),
									)}
								</View>
							</ScrollView>
						) : (
							/* NORMAL SPEC TABLE */
							<View style={styles.table}>
								{product.specifications?.length ? (
									product.specifications.map((spec: any, index: number) => (
										<View key={index} style={styles.row}>
											<Text style={styles.cellHeader}>
												{safeValue(spec.property)}
											</Text>

											<Text style={styles.cell}>{safeValue(spec.value)}</Text>
										</View>
									))
								) : (
									<Text>-</Text>
								)}
							</View>
						)}

						{/* APPLICATIONS */}
						<Text style={styles.section}>Applications</Text>

						<Text style={styles.text}>{safeValue(product.appData)}</Text>

						{/* PACKAGING */}
						<Text style={styles.section}>Packaging</Text>

						<Text style={styles.text}>{safeValue(product.packaging)}</Text>

						{/* ADDITIONAL INFO */}
						<Text style={styles.section}>Additional Information</Text>

						<Text style={styles.text}>SBU: {safeValue(product.SBU)}</Text>

						<Text style={styles.text}>
							Industrial Use: {safeValue(product.industrial)}
						</Text>

						<Text style={styles.text}>
							Documentation: {safeValue(product.documentation)}
						</Text>

						<Text style={styles.text}>
							Alternatives: {safeValue(product.alternatives)}
						</Text>

						<Text style={styles.text}>
							Related Products: {safeValue(product.related)}
						</Text>
					</ScrollView>
				</View>
			</SafeAreaView>
		</Modal>
	);
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},

	header: {
		height: 60,
		borderBottomWidth: 1,
		borderColor: "#ddd",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 15,
	},

	close: {
		color: "red",
		fontSize: 16,
		fontWeight: "600",
	},

	share: {
		color: "#007AFF",
		fontSize: 16,
		fontWeight: "600",
	},

	shareBtn: {
		flexDirection: "row",
		alignItems: "center",
	},

	content: {
		padding: 20,
	},

	title: {
		fontSize: 20,
		fontWeight: "700",
		color: "#02257b",
	},

	subtitle: {
		fontSize: 14,
		color: "#555",
		marginBottom: 12,
	},

	section: {
		marginTop: 16,
		fontWeight: "700",
		fontSize: 14,
		color: "#002679",
	},

	text: {
		fontSize: 13,
		marginTop: 4,
	},

	table: {
		marginTop: 10,
		borderWidth: 1,
		borderColor: "#444",
	},

	row: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: "#444",
	},

	headerRow: {
		backgroundColor: "#E0F2FE",
	},

	cellHeader: {
		width: "40%",
		padding: 6,
		fontWeight: "700",
		color: "#002679",
		borderRightWidth: 1,
		borderColor: "#444",
	},

	cell: {
		flex: 1,
		padding: 6,
	},

	compareHeaderCell: {
		minWidth: 120,
		padding: 8,
		fontWeight: "700",
		textAlign: "center",
		borderRightWidth: 1,
		borderColor: "#444",
		color: "#002679",
	},

	compareCell: {
		minWidth: 120,
		padding: 8,
		textAlign: "center",
		borderRightWidth: 1,
		borderColor: "#444",
	},

	comparePropertyCell: {
		minWidth: 150,
		flexGrow: 1,
		fontWeight: "700",
		textAlign: "left",
	},
});
