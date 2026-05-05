/* eslint-disable react-hooks/exhaustive-deps */
import Header from "@/components/Ui/Header";
import ScrollComponent from "@/components/Ui/ScrollComponent";
import devData from "@/constants/newDevData.json";
import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { ProductData } from "@/hooks/types";
import {
	getSearchHistory,
	saveSearchToHistory,
	SearchHistoryItem,
} from "@/utils/searchHistory";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
	const parsedAnswers = useMemo(() => {
		try {
			const parsed = JSON.parse(rawResponse);
			return Array.isArray(parsed) ? parsed : rawResponse ? [rawResponse] : [];
		} catch {
			return rawResponse ? [rawResponse] : [];
		}
	}, [rawResponse]);

	/* ---------------- HISTORY ---------------- */
	const hasSaved = useRef(false);
	const [history, setHistory] = useState<SearchHistoryItem[]>([]);
	const [historyVisible, setHistoryVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(async () => {
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
			const filtered = stored.filter((item) => item.question !== question);

			setHistory((prev) => {
				const same = JSON.stringify(prev) === JSON.stringify(filtered);
				return same ? prev : filtered;
			});
		}, 300);

		return () => clearTimeout(timeout);
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

	const formatAnswer = (text: string) => {
		const lines: string[] = text.split("\n");

		// 🔹 Normalize helper
		const normalize = (line: string) =>
			line
				.trim()
				.toLowerCase()
				.replace(/^[-•]\s*/, "");

		// 🔹 Detect section type (robust)
		const getSectionType = (index: number) => {
			for (let i = index - 1; i >= 0; i--) {
				const prev = normalize(lines[i]);

				if (prev.endsWith(":")) {
					if (prev.includes("key specifications")) return "spec";
					if (prev.includes("applications")) return "application";
					if (prev.includes("description")) return "description";
					return "other";
				}
			}
			return null;
		};

		let specIndex = 0; // for alternating UI

		return (
			<View>
				{lines.map((line: string, index: number) => {
					const trimmed = line.trim();

					if (!trimmed) return null;

					// 🔹 First line (title)
					if (index === 0) {
						return (
							<Text
								key={index}
								style={{
									color: Colors.blueDeep,
									fontWeight: "bold",
									fontSize: 16,
									marginBottom: 8,
								}}
							>
								{line}
							</Text>
						);
					}

					// 🔹 Section headers
					const normalized = normalize(line);
					if (
						normalized.endsWith(":") &&
						!trimmed.startsWith("-") &&
						!trimmed.startsWith("•")
					) {
						return (
							<Text
								key={index}
								style={{
									color: Colors.bluePrimary,
									fontWeight: "600",
									marginTop: 10,
									marginBottom: 4,
								}}
							>
								{line}
							</Text>
						);
					}

					// 🔹 Bullet detection
					const isBullet = trimmed.startsWith("-") || trimmed.startsWith("•");

					const section = getSectionType(index);

					// 🔥 SPEC CARDS (main logic)
					if (section === "spec" && isBullet && trimmed.includes(":")) {
						const clean = trimmed.replace(/^[-•]\s*/, "");

						const colonIndex = clean.indexOf(":");
						if (colonIndex === -1) return null;

						const key = clean.slice(0, colonIndex);
						const value = clean.slice(colonIndex + 1).trim();

						// 🔁 Alternating UI
						const isEven = specIndex % 2 === 0;
						specIndex++;

						return (
							<View
								key={index}
								style={{
									borderRadius: 6,
									paddingVertical: 10,
									paddingHorizontal: 12,
									borderWidth: 1,
									borderColor: "#777",

									borderLeftWidth: isEven ? 3 : 1,
									borderRightWidth: isEven ? 1 : 3,

									borderLeftColor: isEven
										? Colors.bluePrimary
										: Colors.grayDeep,
									borderRightColor: !isEven
										? Colors.bluePrimary
										: Colors.grayDeep,

									alignSelf: isEven ? "flex-start" : "flex-end",

									width: "90%",
									marginBottom: 6,
									marginTop: 4,
									backgroundColor: isEven ? "#f9fbff" : "#f4f8ff",
								}}
							>
								<Text
									style={{
										color: Colors.blueDeep,
										fontSize: 12,
										fontWeight: "600",
										marginBottom: 4,
									}}
								>
									{key + ":"}
								</Text>

								<Text
									style={{
										fontSize: 14,
										color: "#222",
									}}
								>
									{value}
								</Text>
							</View>
						);
					}

					// 🔹 Normal bullets (non-spec)
					if (isBullet) {
						return (
							<Text
								key={index}
								style={{
									marginLeft: 6,
									marginBottom: 2,
								}}
							>
								{line}
							</Text>
						);
					}

					// 🔹 Default text
					return (
						<Text
							key={index}
							style={{
								marginBottom: 2,
							}}
						>
							{line}
						</Text>
					);
				})}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Header caption="Search Result" />
			<View style={styles.divider} />

			<ScrollComponent padding={20} verticalSroll key={question}>
				{/* TOP ROW */}
				<View style={styles.topRow}>
					<Text style={styles.sectionTitle}>Result</Text>

					<TouchableOpacity onPress={() => setHistoryVisible(true)}>
						<Text style={styles.historyBtn}>History</Text>
					</TouchableOpacity>
				</View>

				{/* QUESTION */}
				<View style={styles.row}>
					<Ionicons
						name="person-circle-outline"
						size={26}
						color={Colors.orangeRed}
					/>

					<View style={styles.questionView}>
						<Text style={styles.question}>{question}</Text>
					</View>
				</View>

				{/* ANSWERS */}
				{parsedAnswers.map((item, index) => {
					console.log("parsed Answer:", item);
					return (
						<View key={index} style={styles.rowAnswer}>
							<Ionicons
								name="chatbubble-ellipses-outline"
								size={24}
								color={Colors.blueDark}
							/>

							<View style={{ flex: 1 }}>
								<Text style={styles.text}>{formatAnswer(item)}</Text>
								{/* <Text style={styles.text}>{item.value}</Text> */}
							</View>
						</View>
					);
				})}

				{/* PRODUCT CARD */}
				{product && (
					<LinearGradient
						colors={[Colors.blueDark, Colors.blueBright]}
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
						and our team will assist you
					</Text>

					<Image source={ALL_IMAGES.HAPPINESS_ICON} style={styles.happiness} />
				</View>
			</ScrollComponent>

			{/* HISTORY MODAL */}
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
								<Text style={{ textAlign: "center" }}>
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

	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		gap: 1,
		marginBottom: 10,
	},

	rowAnswer: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 4,
		marginBottom: 15,
	},

	questionView: {
		// backgroundColor: Colors.gray,
		borderRadius: 20,
		padding: 15,
		// flex: 1,
	},

	question: {
		fontSize: 16,
		fontWeight: "600",
		color: Colors.orangeRed,
	},

	text: {
		fontSize: 15,
		lineHeight: 22,
	},

	productCard: {
		marginTop: 20,
		padding: 16,
		borderRadius: 12,
	},

	productTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: Colors.white,
	},

	productDesc: {
		marginTop: 6,
		fontSize: 14,
		color: "#eee",
	},

	buttonRow: {
		flexDirection: "row",
		marginTop: 14,
	},

	outlineBtn: {
		borderWidth: 1,
		borderColor: Colors.white,
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},

	outlineText: {
		color: Colors.white,
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
