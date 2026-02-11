import Header from "@/components/Ui/Header";
import devData from "@/constants/Jsons/newDevData.json";
import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { ProductData } from "@/hooks/types";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
	Image,
	Linking,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function ResultScreen() {
	const { response, productCode, question } = useLocalSearchParams();

	const getProduct = (key?: string): ProductData | null => {
		if (key === null || !key) {
			return null;
		}
		return devData[key as keyof typeof devData] ?? null;
	};

	const productDetails = (dataKey: any) => {
		return getProduct(dataKey as string);
	};

	return (
		<View style={styles.container}>
			<Header caption={"Search Result"} />
			<View style={styles.divider}></View>
			<ScrollView
				contentContainerStyle={{
					flex: 1,
					padding: 10,
					marginBottom: 350,
					backgroundColor: "#eee",
				}}
			>
				<View style={styles.questionView}>
					<Text
						style={styles.question}
						numberOfLines={2}
						adjustsFontSizeToFit
						minimumFontScale={0.65}
					>
						{question}
					</Text>
				</View>
				<Text style={styles.text}>{response}</Text>
				{productCode !== "na" && (
					<LinearGradient
						colors={[Colors.blueDeep, Colors.blueLight]}
						style={styles.productCard}
					>
						<Text style={styles.productTitle}>
							{productDetails(productCode)?.title}
						</Text>
						<Text style={styles.productDesc}>
							{productDetails(productCode)?.subTitle}
						</Text>

						<View style={styles.buttonRow}>
							<TouchableOpacity
								style={styles.outlineBtn}
								onPress={() =>
									router.push({
										pathname: "/InfoScreen",
										params: { name: productCode },
									})
								}
							>
								<Text style={styles.outlineText}>View page</Text>
							</TouchableOpacity>
						</View>
					</LinearGradient>
				)}
				<View style={[styles.divider, { marginVertical: 20 }]}></View>
				<View
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "column",
						height: 150,
						paddingHorizontal: 20,
					}}
				>
					<Text
						style={{
							textAlign: "justify",
							fontSize: 18,
							fontWeight: "400",
						}}
					>
						Please reach us @
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
					<Image source={ALL_IMAGES.HAPPINESS_ICON} style={styles.happiness} />
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#eee",
		height: "100%",
	},
	questionView: {
		color: Colors.blueDark,
		backgroundColor: Colors.gray,
		width: "auto",
		borderRadius: 20,
		alignSelf: "flex-end",
		marginVertical: 10,
		shadowColor: "#444",
		shadowOpacity: 0.25,
		shadowRadius: 3,
		shadowOffset: { width: 1, height: 1 },
		padding: 15,
	},
	divider: {
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		marginVertical: 10,
		marginHorizontal: 20,
	},
	question: {
		fontSize: 18,
		fontWeight: "700",
		textAlign: "right",
		color: Colors.blueDark,
	},
	title: {
		fontSize: 16,
		fontWeight: "700",
		marginBottom: 10,
	},
	text: {
		fontSize: 16,
		lineHeight: 24,
		textAlign: "justify",
	},
	code: {
		marginTop: 15,
		fontWeight: "600",
		color: "#1E3A8A",
	},
	productCard: {
		marginTop: 12,
		padding: 16,
		borderRadius: 12,
	},
	productTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#fff",
	},
	productDesc: {
		marginTop: 6,
		fontSize: 14,
		color: "#E5E7EB",
	},
	buttonRow: {
		flexDirection: "row",
		marginTop: 14,
	},
	outlineBtn: {
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginRight: 10,
	},
	outlineText: {
		color: "#fff",
		fontSize: 13,
		fontWeight: "600",
	},
	happiness: {
		height: 100,
		width: 130,
		alignSelf: "flex-end",
	},
});
