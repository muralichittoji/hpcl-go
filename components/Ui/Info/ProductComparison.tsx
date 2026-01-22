import React, { useCallback, useMemo, useState } from "react";
import {
	Image,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import productDetails from "@/constants/Jsons/InfoData.json";
import wholeData from "@/constants/Jsons/wholeData.json";
import { Colors } from "@/constants/theme";

const HappinessIcon = "@/assets/images/icons/DeliveringHappiness.png";

type ProductValue = string;

const ProductComparison = () => {
	/* -------------------- STATE -------------------- */

	const [product1, setProduct1] = useState<ProductValue>("");
	const [product2, setProduct2] = useState<ProductValue>("");
	const [product3, setProduct3] = useState<ProductValue>("");

	const [open1, setOpen1] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	const [showComparison, setShowComparison] = useState(false);

	/* -------------------- HELPERS -------------------- */

	// const selectedProducts = useMemo(
	//   () => [product1, product2, product3].filter(Boolean),
	//   [product1, product2, product3],
	// );

	const selectedProducts = useMemo(
		() => [product1, product2, product3].filter(Boolean),
		[product1, product2, product3],
	);

	const canCompare = selectedProducts.length >= 2;
	const getItems = useCallback(
		(current: string) =>
			wholeData.products.filter(
				(p) => p.value === current || !selectedProducts.includes(p.value),
			),
		[selectedProducts],
	);

	const items1 = useMemo(() => getItems(product1), [product1, getItems]);

	const items2 = useMemo(() => getItems(product2), [product2, getItems]);

	const items3 = useMemo(() => getItems(product3), [product3, getItems]);

	/* -------------------- UI -------------------- */

	return (
		<View style={styles.container}>
			<Text style={styles.icon}>⚖️</Text>
			<Text style={styles.title}>Product Comparison</Text>
			<Text style={styles.subtitle}>Select at least 2 products to compare</Text>

			{/* Dropdown 1 */}
			<DropDownPicker
				open={open1}
				value={product1}
				items={items1}
				setOpen={setOpen1}
				setValue={setProduct1}
				placeholder="Select product"
				listMode="SCROLLVIEW"
				style={styles.dropdown}
				zIndex={3000}
				zIndexInverse={1000}
			/>

			{/* Dropdown 2 */}
			<DropDownPicker
				open={open2}
				value={product2}
				items={items2}
				setOpen={setOpen2}
				setValue={setProduct2}
				placeholder="Select product"
				listMode="SCROLLVIEW"
				style={styles.dropdown}
				zIndex={2000}
				zIndexInverse={2000}
			/>

			{/* Dropdown 3 */}
			<DropDownPicker
				open={open3}
				value={product3}
				items={items3}
				setOpen={setOpen3}
				setValue={setProduct3}
				placeholder="Select product"
				listMode="SCROLLVIEW"
				style={styles.dropdown}
				zIndex={1000}
				zIndexInverse={3000}
			/>

			{/* Compare Button */}
			<TouchableOpacity
				style={[styles.button, !canCompare && styles.disabledButton]}
				disabled={!canCompare}
				onPress={() => setShowComparison(true)}
			>
				<Text style={styles.buttonText}>COMPARE</Text>
			</TouchableOpacity>

			{/* -------------------- MODAL -------------------- */}
			<Modal
				transparent
				animationType="slide"
				visible={showComparison}
				onRequestClose={() => setShowComparison(false)}
			>
				<SafeAreaView style={styles.modalSafeArea}>
					<View style={styles.overlay}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Comparison</Text>
							<TouchableOpacity
								onPress={() => setShowComparison(false)}
								style={styles.closeButton}
							>
								<Text style={styles.closeText}>✕</Text>
							</TouchableOpacity>
						</View>

						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								paddingHorizontal: 16,
								// paddingBottom: 40,
							}}
						>
							{selectedProducts.map((key) => {
								const product =
									productDetails[key as keyof typeof productDetails];

								if (!product) return null;

								return (
									<View key={key} style={styles.card}>
										<Text style={styles.cardTitle}>{product.title}</Text>
										<Text style={styles.cardSubTitle}>{product.subTitle}</Text>
										<View style={styles.divider} />
										<Text style={styles.section}>Description</Text>
										<Text style={styles.text}>{product.description}</Text>

										<Text style={styles.section}>Specifications</Text>
										<View style={styles.divider} />
										{product.specifications
											.slice(0, 4)
											.map((spec: any, index: number) => (
												<View
													key={`${spec.property}-${index}`}
													style={styles.specRow}
												>
													<Text style={styles.specKey}>{spec.property}:</Text>
													<Text style={styles.specValue}>{spec.value}</Text>
												</View>
											))}

										<Text style={styles.section}>Applications</Text>
										<View style={styles.divider} />
										<Text style={styles.text}>{product.appData}</Text>

										<Text style={styles.section}>Packaging</Text>
										<View style={styles.divider} />
										<Text style={styles.text}>
											{product.packaging.join(", ")}
										</Text>

										<Image
											source={require(HappinessIcon)}
											style={styles.happiness}
										/>
									</View>
								);
							})}
						</ScrollView>
					</View>
				</SafeAreaView>
			</Modal>
		</View>
	);
};

export default ProductComparison;

const styles = StyleSheet.create({
	container: {
		padding: 16,
		flex: 1,
		backgroundColor: "#f5f6fa",
	},
	modalSafeArea: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		paddingVertical: 20,
	},

	picker: { color: Colors.black },
	divider: {
		height: 1,
		backgroundColor: Colors.blueLight,
	},
	icon: {
		fontSize: 40,
		textAlign: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 8,
	},
	subtitle: {
		textAlign: "center",
		color: "#666",
		marginBottom: 16,
	},
	dropdown: {
		backgroundColor: "#fff",
		borderRadius: 8,
		marginBottom: 12,
		overflow: "hidden",
	},
	button: {
		backgroundColor: "#0a3d62",
		padding: 14,
		borderRadius: 8,
		marginTop: 8,
	},
	disabledButton: {
		backgroundColor: "#b2bec3",
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontWeight: "bold",
	},
	overlay: {
		// maxHeight: '100%',
		// overflow: 'hidden',
		// height: '100%',
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	modalHeader: {
		backgroundColor: "#fff",
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.blueDark,
	},
	closeButton: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "rgba(0,0,0,0.2)",
		justifyContent: "center",
		alignItems: "center",
	},

	closeText: {
		color: "#fff",
		fontSize: 25,
		fontWeight: "900",
	},
	cardContainer: {
		padding: 16,
	},
	card: {
		width: 300,
		backgroundColor: "#fff",
		minHeight: 500,
		borderRadius: 12,
		padding: 16,
		marginRight: 16,
		marginVertical: 10,
		elevation: 6,
		display: "flex",
		justifyContent: "space-between",
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: Colors.blueDark,
	},
	cardSubTitle: {
		fontSize: 12,
		color: "#777",
		marginBottom: 8,
	},
	section: {
		marginTop: 12,
		fontWeight: "bold",
		color: Colors.blueDeep,
	},
	text: {
		fontSize: 12,
		marginTop: 4,
		textAlign: "justify",
	},
	specRow: {
		flexDirection: "column",
		justifyContent: "space-between",
		marginTop: 4,
	},
	specKey: {
		fontSize: 11,
		fontWeight: "700",
	},
	specValue: {
		fontSize: 11,
	},
	happiness: { height: 100, width: 130, alignSelf: "flex-end" },
});
