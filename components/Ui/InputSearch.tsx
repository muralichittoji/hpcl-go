import { Colors } from "@/constants/theme";
import {
	addMessage,
	Chat,
	CHAT_PAGE_SIZE,
	clearChats,
	createChat,
	getChatsPage,
} from "@/lib/chat";
import { runSearchTask } from "@/lib/searchRunner";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
	mode?: "new" | "continue";
	localChatId?: number;
	onMessageAdded?: () => void;
	isSearching?: boolean;
	onStop?: () => void;
	draftText?: string | null;
	onDraftTextApplied?: () => void;
	isOnline?: boolean;
};

const InputSearch = ({
	setLoading,
	setSlowNet,
	placeHolder = "Search Products",

	mode = "new",

	localChatId,

	onMessageAdded,

	isSearching = false,
	onStop,
	draftText,
	onDraftTextApplied,
	isOnline = true,
}: SearchProps) => {
	const [search, setSearch] = useState("");
	const [historyVisible, setHistoryVisible] = useState(false);
	const [history, setHistory] = useState<Chat[]>([]);
	const [historyOffset, setHistoryOffset] = useState(0);
	const [historyHasMore, setHistoryHasMore] = useState(false);
	const [historyLoading, setHistoryLoading] = useState(false);
	const historyLoadingRef = useRef(false);

	useEffect(() => {
		if (!draftText) return;

		setSearch(draftText);
		onDraftTextApplied?.();
	}, [draftText, onDraftTextApplied]);

	const loadHistoryPage = useCallback((offset = 0, append = false) => {
		if (historyLoadingRef.current) return;

		historyLoadingRef.current = true;
		setHistoryLoading(true);

		try {
			const { items, hasMore } = getChatsPage(offset, CHAT_PAGE_SIZE);

			setHistory((prev) => (append ? [...prev, ...items] : items));
			setHistoryOffset(offset + items.length);
			setHistoryHasMore(hasMore);
		} finally {
			historyLoadingRef.current = false;
			setHistoryLoading(false);
		}
	}, []);

	const openHistory = () => {
		setHistoryVisible(true);
		loadHistoryPage(0, false);
	};

	const loadMoreHistory = () => {
		if (!historyHasMore || historyLoading) return;
		loadHistoryPage(historyOffset, true);
	};

	const findScreen = () => {
		const question = search.trim();

		if (!question || isSearching) return;

		let chatId = localChatId ?? 0;

		if (mode === "new") {
			chatId = createChat(question);
		}

		const userMessageId = addMessage(chatId, "user", question);

		setSearch("");

		runSearchTask({
			chatId,
			userMessageId,
			question,
			isOnline,
		});

		if (mode === "new") {
			router.push({
				pathname: "/(tabs)/ResultScreen",
				params: {
					chatLocalId: chatId.toString(),
				},
			});
		} else {
			onMessageAdded?.();
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
						editable={!isSearching}
					/>
				</View>

				{isSearching ? (
					<TouchableOpacity
						style={styles.stopButton}
						onPress={onStop}
						accessibilityLabel="Stop search"
					>
						<Ionicons name="stop" size={22} color="#F00" />
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={styles.historyButton} onPress={openHistory}>
						<Ionicons name="time-outline" size={24} color={Colors.blueDark} />
					</TouchableOpacity>
				)}
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
							onEndReached={loadMoreHistory}
							onEndReachedThreshold={0.4}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.historyItem}
									onPress={() => {
										setHistoryVisible(false);

										router.push({
											pathname: "/(tabs)/ResultScreen",
											params: {
												chatLocalId: item.id.toString(),
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
										<Text style={styles.historyText}>{item.title}</Text>

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
							ListEmptyComponent={() =>
								historyLoading ? null : (
									<Text
										style={{
											textAlign: "center",
											padding: 20,
										}}
									>
										No Search History
									</Text>
								)
							}
							ListFooterComponent={
								historyLoading ? (
									<Text
										style={{
											textAlign: "center",
											padding: 12,
											color: "#999",
										}}
									>
										Loading...
									</Text>
								) : null
							}
						/>
						<View
							style={{ flexDirection: "row", justifyContent: "space-around" }}
						>
							<TouchableOpacity
								style={styles.clearButton}
								onPress={() => {
									clearChats();
									setHistory([]);
									setHistoryOffset(0);
									setHistoryHasMore(false);
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
	stopButton: {
		width: 35,
		height: 35,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#f00",
		borderRadius: 16,
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
