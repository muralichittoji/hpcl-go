import React, { useMemo } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { getProductSummaries, ProductSummary } from "@/lib/products";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";

type Props = {
	related?: string[];
};

const RelatedProducts = ({ related = [] }: Props) => {
	const products = useMemo(
		() => getProductSummaries(related),
		[related.join("|")],
	);

	if (!products.length) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Related Products</Text>

			<FlatList
				data={products}
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item.code}
				contentContainerStyle={styles.list}
				renderItem={({ item }: { item: ProductSummary }) => (
					<TouchableOpacity
						style={styles.card}
						onPress={() =>
							router.push({
								pathname: "/InfoScreen",
								params: {
									name: item.code,
								},
							})
						}
					>
						<Text numberOfLines={2} style={styles.title}>
							{item.title}
						</Text>

						<Text numberOfLines={2} style={styles.subtitle}>
							{item.subTitle}
						</Text>

						<View style={styles.footer}>
							<Text style={styles.view}>View →</Text>
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
};

export default RelatedProducts;

const styles = StyleSheet.create({
	container: {
		marginTop: 30,
	},

	heading: {
		fontSize: 18,
		fontWeight: "700",
		color: Colors.blueDark,
		marginBottom: 15,
	},

	list: {
		paddingRight: 20,
	},

	card: {
		width: 190,
		marginRight: 15,
		backgroundColor: "#FFF",
		borderRadius: 18,
		padding: 18,

		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: {
			width: 0,
			height: 4,
		},

		elevation: 5,
	},

	title: {
		fontSize: 17,
		fontWeight: "700",
		color: Colors.blueDark,
	},

	subtitle: {
		fontSize: 14,
		color: "#666",
		marginTop: 8,
		lineHeight: 20,
	},

	footer: {
		marginTop: 20,
		borderTopWidth: 1,
		borderTopColor: "#EEE",
		paddingTop: 12,
	},

	view: {
		fontSize: 14,
		fontWeight: "700",
		color: Colors.blueLight,
	},
});
