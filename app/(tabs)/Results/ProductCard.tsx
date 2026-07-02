import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { ProductData } from "@/hooks/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

type Props = {
	product: ProductData;
	productCode: string;
};

const ProductCard = ({ product, productCode }: Props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>📦 Recommended Product</Text>

			<LinearGradient
				colors={[Colors.blueDeep, Colors.blueLight]}
				style={styles.card}
			>
				<View style={{ alignItems: "center", width: "30%" }}>
					<Image source={ALL_IMAGES.MASTER_ROUNDED} style={styles.image} />
					<Text style={styles.title}>{product.title}</Text>
				</View>
				<View
					style={{ width: "70%", paddingLeft: 20, justifyContent: "center" }}
				>
					{!!product.subTitle && (
						<Text style={styles.subtitle}>{product.subTitle}</Text>
					)}

					<View style={styles.recommendation}>
						<MaterialCommunityIcons
							name="check-circle"
							size={20}
							color="#4ADE80"
						/>

						<Text style={styles.recommendationText}>
							Suitable for your requirement
						</Text>
					</View>
					<TouchableOpacity
						style={styles.button}
						onPress={() =>
							router.push({
								pathname: "/InfoScreen",
								params: { name: productCode },
							})
						}
					>
						<Text style={styles.buttonText}>View Complete Details</Text>
					</TouchableOpacity>
				</View>
			</LinearGradient>
		</View>
	);
};

export default ProductCard;

const styles = StyleSheet.create({
	container: {
		marginTop: 25,
	},

	heading: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 12,
		color: Colors.blueDark,
	},

	card: {
		borderRadius: 24,
		padding: 22,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},

	image: {
		width: 50,
		height: 50,
		marginBottom: 15,
	},

	title: {
		fontSize: 16,
		fontWeight: "700",
		color: "#FFF",
		textAlign: "center",
	},

	subtitle: {
		fontSize: 15,
		color: "#E5E7EB",
		marginTop: 8,
		textAlign: "center",
	},

	button: {
		marginTop: 25,
		backgroundColor: "#FFF",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 25,
	},

	buttonText: {
		color: Colors.blueDark,
		fontWeight: "700",
		fontSize: 15,
	},

	recommendation: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 20,
	},

	recommendationText: {
		color: "#FFF",
		fontSize: 15,
		marginLeft: 8,
		fontWeight: "500",
	},
});
