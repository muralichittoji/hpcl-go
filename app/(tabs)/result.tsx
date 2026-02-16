import Header from "@/components/Ui/Header";
import ScrollComponent from "@/components/Ui/ScrollComponent";
import devData from "@/constants/Jsons/newDevData.json";
import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { ProductData } from "@/hooks/types";
import {
	getSearchHistory,
	saveSearchToHistory,
	SearchHistoryItem,
} from "@/utils/searchHistory";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	Image,
	Linking,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function ResultScreen() {
	const params = useLocalSearchParams();

	/* ---------------- SAFE PARAM EXTRACTION ---------------- */
	const question = typeof params.question === "string" ? params.question : "";

	const rawResponse =
		typeof params.response === "string" ? params.response : "";

	const productCode =
		typeof params.productCode === "string" ? params.productCode : null;

	/* ---------------- PARSE ANSWERS ---------------- */
	let parsedAnswers: string[] = [];

	try {
		const parsed = JSON.parse(rawResponse);
		parsedAnswers = Array.isArray(parsed)
			? parsed
			: rawResponse
				? [rawResponse]
				: [];
	} catch {
		parsedAnswers = rawResponse ? [rawResponse] : [];
	}

	/* ---------------- HISTORY ---------------- */
	const hasSaved = useRef(false);
	const [history, setHistory] = useState<SearchHistoryItem[]>([]);
	const [historyVisible, setHistoryVisible] = useState(false);

	useEffect(() => {
		const init = async () => {
			if (!question || parsedAnswers.length === 0) return;

			if (!hasSaved.current) {
				await saveSearchToHistory({
					id: Date.now().toString(),
					question,
					answers: parsedAnswers,
					productCode,
					createdAt: Date.now(),
				});

				hasSaved.current = true;
			}

			const stored = await getSearchHistory();

			// remove current question from modal list
			const filtered = stored.filter((item) => item.question !== question);

			setHistory(filtered);
		};

		init();
	}, [question]);

	/* ---------------- PRODUCT ---------------- */
	const getProduct = (key?: string): ProductData | null => {
		if (!key) return null;
		return devData[key as keyof typeof devData] ?? null;
	};

	const product = productCode ? getProduct(productCode) : null;

	/* ---------------- SAFETY ---------------- */
	if (!question || parsedAnswers.length === 0) {
		return (
			<View style={styles.container}>
				<Header caption="Search Result" />
				<View style={styles.divider} />
				<Text style={{ padding: 20 }}>
					No result found. Please search again.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Header caption="Search Result" />
			<View style={styles.divider} />

			<ScrollComponent padding={20} verticalSroll>
				{/* TOP ROW */}
				<View style={styles.topRow}>
					<Text style={styles.sectionTitle}>Result</Text>

					<TouchableOpacity onPress={() => setHistoryVisible(true)}>
						<Text style={styles.historyBtn}>History</Text>
					</TouchableOpacity>
				</View>

				{/* QUESTION */}
				<View style={styles.questionView}>
					<Text style={styles.question}>{question}</Text>
				</View>

				{/* ANSWERS */}
				{parsedAnswers.map((item, index) => (
					<View key={index} style={{ marginBottom: 15 }}>
						<Text style={styles.text}>{item}</Text>
					</View>
				))}

				{/* PRODUCT CARD */}
				{product && (
					<LinearGradient
						colors={[Colors.blueDeep, Colors.blueLight]}
						style={styles.productCard}
					>
						<Text style={styles.productTitle}>{product.title}</Text>

						<Text style={styles.productDesc}>{product.subTitle}</Text>

						<View style={styles.buttonRow}>
							<TouchableOpacity
								style={styles.outlineBtn}
								onPress={() =>
									router.push({
										pathname: "/InfoScreen",
										params: {
											name: productCode,
										},
									})
								}
							>
								<Text style={styles.outlineText}>View page</Text>
							</TouchableOpacity>
						</View>
					</LinearGradient>
				)}

				{/* SUPPORT */}
				<View style={styles.supportBox}>
					<Text style={styles.supportText}>
						Please reach out to us at{" "}
						<Text
							style={styles.supportLink}
							onPress={() => Linking.openURL("mailto:productsupport@hpcl.in")}
						>
							productsupport@hpcl.in
						</Text>{" "}
						and our team will be happy to assist you with the necessary details
					</Text>

					<Image source={ALL_IMAGES.HAPPINESS_ICON} style={styles.happiness} />
				</View>
			</ScrollComponent>

			{/* ---------------- HISTORY MODAL ---------------- */}
			<Modal visible={historyVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<View style={styles.modalBox}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Previous Searches</Text>

							<TouchableOpacity onPress={() => setHistoryVisible(false)}>
								<Text style={styles.closeBtn}>Close</Text>
							</TouchableOpacity>
						</View>

						<ScrollView>
							{history.length === 0 ? (
								<Text
									style={{
										textAlign: "center",
									}}
								>
									No history available
								</Text>
							) : (
								history.map((item) => (
									<TouchableOpacity
										key={item.id}
										style={styles.historyCard}
										onPress={() => {
											setHistoryVisible(false);

											router.replace({
												pathname: "/(tabs)/result",
												params: {
													question: item.question,
													response: JSON.stringify(item.answers),
													productCode: item.productCode ?? "",
												},
											});
										}}
									>
										<Text style={styles.historyQuestion}>{item.question}</Text>

										<Text style={styles.historyTime}>
											{new Date(item.createdAt).toLocaleString()}
										</Text>
									</TouchableOpacity>
								))
							)}
						</ScrollView>
					</View>
				</View>
			</Modal>
		</View>
	);
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#eee",
		flex: 1,
	},
	divider: {
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		marginVertical: 10,
		marginHorizontal: 20,
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
	},
	historyBtn: {
		color: Colors.blueLight,
		fontWeight: "600",
	},
	questionView: {
		backgroundColor: Colors.gray,
		borderRadius: 20,
		alignSelf: "flex-end",
		marginVertical: 10,
		padding: 15,
	},
	question: {
		fontSize: 18,
		fontWeight: "700",
		textAlign: "right",
		color: Colors.blueDark,
	},
	text: {
		fontSize: 16,
		lineHeight: 24,
		textAlign: "justify",
	},
	productCard: {
		marginTop: 20,
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
	},
	outlineText: {
		color: "#fff",
		fontSize: 13,
		fontWeight: "600",
	},
	supportBox: {
		marginTop: 30,
		alignItems: "center",
	},
	supportText: {
		textAlign: "justify",
		fontSize: 16,
	},
	supportLink: {
		color: Colors.blueLight,
		textDecorationLine: "underline",
	},
	happiness: {
		height: 100,
		width: 130,
		resizeMode: "contain",
		marginTop: 20,
		alignSelf: "flex-end",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
	},
	modalBox: {
		backgroundColor: "#fff",
		marginHorizontal: 20,
		borderRadius: 16,
		padding: 20,
		maxHeight: "70%",
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "700",
	},
	closeBtn: {
		color: "red",
		fontWeight: "600",
	},
	historyCard: {
		backgroundColor: "#f9f9f9",
		padding: 12,
		borderRadius: 8,
		marginBottom: 10,
	},
	historyQuestion: {
		fontWeight: "600",
	},
	historyTime: {
		fontSize: 12,
		color: "#777",
		marginTop: 4,
	},
});
