import React from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import devData from "@/constants/newDevData.json";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";

type Props = {
	related?: string[];
};

const RelatedProducts = ({ related = [] }: Props) => {
	if (!related.length) return null;

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Related Products</Text>

			<FlatList
				data={related}
				horizontal
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item) => item}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => {
					const product = devData[item as keyof typeof devData];

					if (!product) return null;

					return (
						<TouchableOpacity
							style={styles.card}
							onPress={() =>
								router.push({
									pathname: "/InfoScreen",
									params: {
										name: item,
									},
								})
							}
						>
							<Text numberOfLines={2} style={styles.title}>
								{product.title}
							</Text>

							<Text numberOfLines={2} style={styles.subtitle}>
								{product.subTitle}
							</Text>

							<View style={styles.footer}>
								<Text style={styles.view}>View →</Text>
							</View>
						</TouchableOpacity>
					);
				}}
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
