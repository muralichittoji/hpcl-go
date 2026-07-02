import { Colors } from "@/constants/theme";
import { getAnswer } from "@/utils/authService";
import {
	clearHistory,
	deleteHistory,
	getHistory,
	insertQuestion,
	SearchHistoryItem,
	updateAnswer,
} from "@/utils/historyRepository";
import { useNetwork } from "@/utils/NetworkProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	Dimensions,
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const { width } = Dimensions.get("window");

type SearchProps = {
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setSlowNet: React.Dispatch<React.SetStateAction<boolean>>;
	placeHolder?: string;
};

const InputSearch = ({
	setLoading,
	setSlowNet,

	placeHolder = "Search Products",
}: SearchProps) => {
	const [search, setSearch] = useState("");
	const { isOnline } = useNetwork();
	const [lowNetwork, setLowNetwork] = useState<boolean>(false);
	const [historyVisible, setHistoryVisible] = useState(false);
	const [history, setHistory] = useState<SearchHistoryItem[]>([]);

	const findScreen = () => {
		if (!search.trim()) return;

		getSearch(search.trim());
	};

	const safeParse = (text: string) => {
		try {
			const first = JSON.parse(text);

			// Handle double-encoded JSON (very common with Azure)
			if (typeof first === "string") {
				try {
					return JSON.parse(first);
				} catch {
					return { response: first };
				}
			}

			return first;
		} catch {
			// Fallback → treat as plain text
			return { response: text };
		}
	};

	const getSearch = async (question: string) => {
		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		let historyId = 0;

		try {
			setLoading(true);

			/* ---------------- Offline ---------------- */

			if (!isOnline) {
				setLowNetwork(true);
				setSlowNet(true);
				return;
			}

			/* ---------------- Timeout ---------------- */

			timeoutId = setTimeout(() => {
				setLoading(false);
				setLowNetwork(true);
				setSlowNet(true);
			}, 90000);

			/* ---------------- Save Question ---------------- */

			historyId = insertQuestion(question);

			/* ---------------- API ---------------- */

			const res = await getAnswer({ question });

			clearTimeout(timeoutId);

			console.log("Raw API Response :", res);

			const rawAnswer = res?.results?.[0]?.answer;

			if (!rawAnswer) {
				deleteHistory(historyId);

				setLowNetwork(true);
				setSlowNet(true);
				return;
			}

			/* ---------------- Parse ---------------- */

			const parsed = safeParse(rawAnswer);

			const finalResponse =
				parsed?.response ?? rawAnswer ?? "No response available";

			const productCode = parsed?.app_product_code ?? null;

			/* ---------------- Update SQLite ---------------- */

			updateAnswer(historyId, finalResponse, productCode);

			setLowNetwork(false);
			setSlowNet(false);

			/* ---------------- Navigate ---------------- */

			router.push({
				pathname: "/(tabs)/ResultScreen",
				params: {
					historyId: historyId.toString(),
				},
			});
		} catch (error) {
			console.log("Search Error :", error);

			if (historyId) {
				deleteHistory(historyId);
			}

			setLowNetwork(true);
			setSlowNet(true);
		} finally {
			setLoading(false);

			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		}
	};

	return (
		<>
			<View style={styles.searchInputContainer}>
				<View style={styles.inputWrapper}>
					<Ionicons name="search" size={22} color="#888" />

					<TextInput
						placeholder={placeHolder}
						placeholderTextColor={Colors.grayDeep}
						style={styles.searchInput}
						value={search}
						onChangeText={setSearch}
						onSubmitEditing={findScreen}
						returnKeyType="search"
					/>
				</View>

				<TouchableOpacity
					style={styles.historyButton}
					onPress={() => {
						const data = getHistory();
						setHistory(data);
						setHistoryVisible(true);
					}}
				>
					<Ionicons name="time-outline" size={24} color={Colors.blueDark} />
				</TouchableOpacity>
			</View>

			<Modal
				visible={historyVisible}
				transparent
				animationType="slide"
				onRequestClose={() => setHistoryVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>Recent Searches</Text>

						<FlatList
							data={history}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.historyItem}
									onPress={() => {
										setHistoryVisible(false);

										router.push({
											pathname: "/(tabs)/ResultScreen",
											params: {
												historyId: item.id.toString(),
											},
										});
									}}
								>
									<Ionicons name="search" size={18} color="#666" />

									<View
										style={{
											flex: 1,
											marginLeft: 12,
										}}
									>
										<Text style={styles.historyText}>{item.question}</Text>

										<Text
											style={{
												fontSize: 12,
												color: "#999",
												marginTop: 3,
											}}
										>
											{new Date(item.createdAt).toLocaleString()}
										</Text>
									</View>
								</TouchableOpacity>
							)}
							ListEmptyComponent={() => (
								<Text
									style={{
										textAlign: "center",
										padding: 20,
									}}
								>
									No Search History
								</Text>
							)}
						/>
						<View
							style={{ flexDirection: "row", justifyContent: "space-around" }}
						>
							<TouchableOpacity
								style={styles.clearButton}
								onPress={() => {
									clearHistory();
									setHistory([]);
								}}
							>
								<Text
									style={{
										color: "#FF3B30",
										fontWeight: "600",
									}}
								>
									Clear History
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.closeButton}
								onPress={() => {
									setHistoryVisible(false);
								}}
							>
								<Text
									style={{
										color: Colors.blueDark,
										fontWeight: "600",
									}}
								>
									Close
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

export default InputSearch;

const styles = StyleSheet.create({
	searchInputContainer: {
		width: "95%",
		maxWidth: "95%",
		height: 50,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#e6e6e6",
		borderRadius: 15,
		marginVertical: 20,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		shadowColor: "#000",
		shadowOpacity: 0.3,
		shadowRadius: 2,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		width: width / 1.27,
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
	},
	historyButton: {
		width: 45,
		height: 45,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
		marginLeft: 8,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "center",
		alignItems: "center",
	},

	modalContainer: {
		width: "90%",
		maxHeight: "70%",
		backgroundColor: "#FFF",
		borderRadius: 18,
		padding: 20,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 10,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		elevation: 8,
	},

	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: Colors.blueDark,
		marginBottom: 15,
		textAlign: "center",
	},

	historyItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 12,
		borderRadius: 10,
		marginBottom: 8,
		backgroundColor: "#F7F8FA",
		borderWidth: 1,
		borderColor: "#ECECEC",
	},

	historyText: {
		flex: 1,
		marginLeft: 12,
		fontSize: 16,
		color: "#333",
	},

	clearButton: {
		marginTop: 15,
		alignSelf: "center",
		paddingVertical: 10,
		paddingHorizontal: 25,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: "#FF3B30",
	},
	closeButton: {
		marginTop: 15,
		alignSelf: "center",
		paddingVertical: 10,
		paddingHorizontal: 25,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: Colors.blueDeep,
	},
});
