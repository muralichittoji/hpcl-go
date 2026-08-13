import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import {
	deleteMessage,
	getOlderMessagesPage,
	getPreviousUserMessage,
	getRecentMessagesPage,
	Message,
	updateMessage,
} from "@/lib/chat";
import {
	getSearchTask,
	runSearchTask,
	searchTaskEmitter,
	stopSearchTask,
} from "@/lib/searchRunner";
import { getApiErrorMessage } from "@/utils/apiErrors";
import { getAnswer } from "@/utils/authService";
import { safeParse } from "@/utils/jsonUtils";
import { useNetwork } from "@/utils/NetworkProvider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	FlatList,
	Image,
	KeyboardAvoidingView,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AIActions from "./Results/AIActions";
import AIMessage from "./Results/AIMessage";
import RelatedProducts from "./Results/RelatedProducts";
import SearchFailureCard from "./Results/SearchFailureCard";
import UserMessage from "./Results/UserMessage";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Message>);

type SearchFailure = {
	type: "error" | "stopped";
	message: string;
	userMessageId: number;
	userMessageText: string;
};

const ResultScreen = () => {
	const params = useLocalSearchParams();
	const { isOnline } = useNetwork();
	const scrollRef = useRef<FlatList<Message>>(null);
	const scrollY = useRef(new Animated.Value(0)).current;
	const isEditingRef = useRef(false);
	const lastProcessedUserId = useRef<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [, setSlowNet] = useState(false);
	const [animatedAssistantId, setAnimatedAssistantId] = useState<number | null>(
		null,
	);

	const chatLocalId = Number(params.chatLocalId);

	const [messages, setMessages] = useState<Message[]>([]);
	const [hasMoreOlder, setHasMoreOlder] = useState(false);
	const [loadingOlder, setLoadingOlder] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [searchFailure, setSearchFailure] = useState<SearchFailure | null>(
		null,
	);
	const [editDraft, setEditDraft] = useState<string | null>(null);
	const [regenerateError, setRegenerateError] = useState<string | null>(null);
	const [showScrollToLatest, setShowScrollToLatest] = useState(false);
	const latestSearchFailureRef = useRef<SearchFailure | null>(null);

	const getLastUserMessage = useCallback(() => {
		if (!messages.length) return null;

		const last = messages[messages.length - 1];

		return last.role === "user" ? last : null;
	}, [messages]);

	const askQuestion = useCallback(async () => {
		const userMessage = getLastUserMessage();

		if (!userMessage) return;

		if (!isOnline) {
			setSearchFailure({
				type: "error",
				message: "No internet connection. Check your network and try again.",
				userMessageId: userMessage.id,
				userMessageText: userMessage.text,
			});
			return;
		}

		setSearchFailure(null);
		setRegenerateError(null);

		await runSearchTask({
			chatId: chatLocalId,
			userMessageId: userMessage.id,
			question: userMessage.text,
			isOnline,
		});
	}, [chatLocalId, getLastUserMessage, isOnline]);

	const handleStopSearch = () => {
		stopSearchTask(chatLocalId);
	};

	const handleRetry = async () => {
		setSearchFailure(null);
		await askQuestion();
	};

	const handleEdit = () => {
		if (!searchFailure) return;
		isEditingRef.current = true;

		setEditDraft(searchFailure.userMessageText);
		deleteMessage(searchFailure.userMessageId);
		setSearchFailure(null);
		loadRecentMessages();
	};

	useEffect(() => {
		latestSearchFailureRef.current = searchFailure;
	}, [searchFailure]);

	const loadRecentMessages = useCallback(() => {
		if (!chatLocalId) return [];

		const { items, hasMore } = getRecentMessagesPage(chatLocalId);

		setMessages(items);
		setHasMoreOlder(hasMore);

		return items;
	}, [chatLocalId]);

	// Keep this screen in sync with shared background task state.
	useEffect(() => {
		if (isEditingRef.current) {
			isEditingRef.current = false;
			return;
		}
		const syncTaskState = () => {
			const task = getSearchTask(chatLocalId);
			const lastUser = getLastUserMessage();
			const currentFailure = latestSearchFailureRef.current;
			const nextIsTyping = task?.status === "running";

			setIsTyping((prev) => (prev === nextIsTyping ? prev : nextIsTyping));

			if (!task || !lastUser || task.userMessageId !== lastUser.id) {
				if (
					currentFailure &&
					lastUser &&
					lastUser.id !== currentFailure.userMessageId
				) {
					setSearchFailure(null);
				}
				return;
			}

			if (task.status === "success") {
				if (currentFailure) {
					setSearchFailure(null);
				}

				const items = loadRecentMessages();

				const lastAssistant = [...items]
					.reverse()
					.find((m) => m.role === "assistant");

				if (lastAssistant) {
					setAnimatedAssistantId(lastAssistant.id);
				}

				return;
			}

			if (task.status === "error") {
				const nextFailure: SearchFailure = {
					type: "error",
					message:
						task.errorMessage ??
						"Request Failed, Please retry or try again later",
					userMessageId: task.userMessageId,
					userMessageText: task.question,
				};

				if (
					!currentFailure ||
					currentFailure.type !== nextFailure.type ||
					currentFailure.userMessageId !== nextFailure.userMessageId ||
					currentFailure.message !== nextFailure.message ||
					currentFailure.userMessageText !== nextFailure.userMessageText
				) {
					setSearchFailure(nextFailure);
				}
				return;
			}

			if (task.status === "stopped") {
				const nextFailure: SearchFailure = {
					type: "stopped",
					message: task.errorMessage ?? "Search stopped by user.",
					userMessageId: task.userMessageId,
					userMessageText: task.question,
				};

				if (
					!currentFailure ||
					currentFailure.type !== nextFailure.type ||
					currentFailure.userMessageId !== nextFailure.userMessageId ||
					currentFailure.message !== nextFailure.message ||
					currentFailure.userMessageText !== nextFailure.userMessageText
				) {
					setSearchFailure(nextFailure);
				}
				return;
			}

			if (currentFailure) {
				setSearchFailure(null);
			}
		};

		syncTaskState();

		const update = (updatedChatId?: number) => {
			if (updatedChatId === chatLocalId) {
				syncTaskState();
			}
		};

		searchTaskEmitter.on("changed", update);

		return () => {
			searchTaskEmitter.off("changed", update);
		};
	}, [chatLocalId, getLastUserMessage, loadRecentMessages]);

	useEffect(() => {
		setSearchFailure(null);
		setEditDraft(null);
		setRegenerateError(null);
		setIsTyping(getSearchTask(chatLocalId)?.status === "running");
	}, [chatLocalId]);

	// Start shared search whenever the latest message is an unanswered user message.
	useEffect(() => {
		const lastUser = getLastUserMessage();
		const lastMessage = messages[messages.length - 1];

		if (!lastUser) return;
		if (lastMessage?.role !== "user") return;

		// Already handled this message
		if (lastProcessedUserId.current === lastUser.id) {
			return;
		}

		lastProcessedUserId.current = lastUser.id;

		const task = getSearchTask(chatLocalId);

		if (task?.userMessageId === lastUser.id) {
			if (task.status === "running") {
				setIsTyping(true);
			}
			return;
		}

		void askQuestion();
	}, [messages]);

	const loadOlderMessages = useCallback(() => {
		if (
			!chatLocalId ||
			loadingOlder ||
			!hasMoreOlder ||
			messages.length === 0
		) {
			return;
		}

		setLoadingOlder(true);

		try {
			const oldestId = messages[0].id;
			const { items, hasMore } = getOlderMessagesPage(chatLocalId, oldestId);

			if (items.length > 0) {
				setMessages((prev) => [...items, ...prev]);
			}

			setHasMoreOlder(hasMore);
		} finally {
			setLoadingOlder(false);
		}
	}, [chatLocalId, hasMoreOlder, loadingOlder, messages]);

	useEffect(() => {
		loadRecentMessages();
	}, [loadRecentMessages]);

	const previousCount = useRef(0);
	const typingScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const shouldAutoScrollRef = useRef(true);
	const contentHeightRef = useRef(0);
	const layoutHeightRef = useRef(0);
	const scrollOffsetYRef = useRef(0);
	const AUTO_SCROLL_BOTTOM_THRESHOLD = 140;

	const getDistanceFromBottom = useCallback(() => {
		return (
			contentHeightRef.current -
			(layoutHeightRef.current + scrollOffsetYRef.current)
		);
	}, []);

	const syncAutoScrollStateFromPosition = useCallback(() => {
		const isNearBottom =
			getDistanceFromBottom() <= AUTO_SCROLL_BOTTOM_THRESHOLD;
		shouldAutoScrollRef.current = isNearBottom;
		setShowScrollToLatest(!isNearBottom && contentHeightRef.current > 0);
	}, [getDistanceFromBottom]);

	const scrollToConversationEnd = useCallback(
		(animated = true, force = false) => {
			if (!force && !shouldAutoScrollRef.current) return;

			shouldAutoScrollRef.current = true;
			setShowScrollToLatest(false);

			setTimeout(() => {
				requestAnimationFrame(() => {
					scrollRef.current?.scrollToEnd({
						animated: false,
					});
				});
			}, 50);
		},
		[],
	);

	const handleAssistantTyping = useCallback(() => {
		if (!shouldAutoScrollRef.current) return;
		if (typingScrollTimeoutRef.current) return;

		typingScrollTimeoutRef.current = setTimeout(() => {
			typingScrollTimeoutRef.current = null;
			if (!shouldAutoScrollRef.current) return;
			scrollRef.current?.scrollToEnd({ animated: false });
		}, 80);
	}, []);

	const handleAssistantTypingComplete = useCallback(() => {
		if (typingScrollTimeoutRef.current) {
			clearTimeout(typingScrollTimeoutRef.current);
			typingScrollTimeoutRef.current = null;
		}

		scrollToConversationEnd(true);
	}, [scrollToConversationEnd]);

	const handleScrollToLatestPress = useCallback(() => {
		scrollToConversationEnd(true, true);
	}, [scrollToConversationEnd]);

	useEffect(() => {
		if (messages.length > previousCount.current) {
			scrollToConversationEnd(true);
		}

		previousCount.current = messages.length;
	}, [messages, scrollToConversationEnd]);

	useEffect(() => {
		return () => {
			if (typingScrollTimeoutRef.current) {
				clearTimeout(typingScrollTimeoutRef.current);
			}
		};
	}, []);

	const regenerate = async (assistantMessage: Message) => {
		try {
			setLoading(true);
			setIsTyping(true);
			setRegenerateError(null);
			setSearchFailure(null);

			const userMessage = getPreviousUserMessage(assistantMessage.id);

			if (!userMessage) {
				const errorMsg = "User message not found";
				console.log(errorMsg);
				setRegenerateError(errorMsg);
				return;
			}

			const res = await getAnswer({
				question: userMessage.text,
			});

			const rawAnswer = res?.results?.[0]?.answer;

			if (!rawAnswer) {
				const errorMsg = "No regenerated answer received.";
				console.log(errorMsg);
				setRegenerateError(errorMsg);
				return;
			}

			// Validate response is JSON-like, not HTML
			if (typeof rawAnswer === "string" && rawAnswer.trim().startsWith("<")) {
				const errorMsg =
					"Server error: Invalid response format. Please try again.";
				console.log(
					"HTML Response received instead of JSON:",
					rawAnswer.substring(0, 100),
				);
				setRegenerateError(errorMsg);
				return;
			}

			/* ---------------- Parse ---------------- */

			const parsed = safeParse(rawAnswer);

			const finalResponse =
				parsed?.response ?? rawAnswer ?? "No response available";

			const productCode = parsed?.app_product_code ?? null;

			/* ---------------- Update Message ---------------- */

			updateMessage(
				assistantMessage.id,
				finalResponse,
				productCode,
				res?.results?.[0]?.queryId ?? null,
			);

			/* ---------------- Refresh Conversation ---------------- */

			loadRecentMessages();
		} catch (error: unknown) {
			const errorMsg = getApiErrorMessage(error, isOnline);
			console.log("Regenerate Error:", error);
			setRegenerateError(errorMsg);
		} finally {
			setLoading(false);
			setIsTyping(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={80}
			>
				<Header caption="Results Screen" scrollY={scrollY} />
				<View style={{ flex: 1 }}>
					<AnimatedFlatList
						ref={scrollRef}
						data={messages}
						keyExtractor={(item) => item.id.toString()}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
						scrollEventThrottle={16}
						onStartReached={loadOlderMessages}
						onStartReachedThreshold={0.2}
						maintainVisibleContentPosition={{
							minIndexForVisible: 0,
						}}
						contentContainerStyle={{
							paddingHorizontal: 10,
							paddingTop: 10,
							paddingBottom: 120,
						}}
						onLayout={(event) => {
							layoutHeightRef.current = event.nativeEvent.layout.height;
							syncAutoScrollStateFromPosition();
						}}
						onContentSizeChange={() => {
							if (!shouldAutoScrollRef.current) return;

							setTimeout(() => {
								requestAnimationFrame(() => {
									scrollRef.current?.scrollToEnd({ animated: true });
								});
							}, 0);
						}}
						onScroll={Animated.event(
							[
								{
									nativeEvent: {
										contentOffset: {
											y: scrollY,
										},
									},
								},
							],
							{
								useNativeDriver: false,
								listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
									scrollOffsetYRef.current = event.nativeEvent.contentOffset.y;
									layoutHeightRef.current =
										event.nativeEvent.layoutMeasurement.height;
									contentHeightRef.current =
										event.nativeEvent.contentSize.height;
									syncAutoScrollStateFromPosition();
								},
							},
						)}
						renderItem={({ item, index }) => {
							if (item.role === "user") {
								return <UserMessage question={item.text} />;
							}

							return (
								<View>
									<AIMessage
										answer={item.text}
										animate={item.id === animatedAssistantId}
										onTyping={
											index === messages.length - 1
												? handleAssistantTyping
												: undefined
										}
										onTypingComplete={() => {
											setAnimatedAssistantId(null);
											handleAssistantTypingComplete();
										}}
										onProductPress={(productCode) =>
											router.push({
												pathname: "/InfoScreen",
												params: { name: productCode },
											})
										}
									/>
									<AIActions
										answer={item.text}
										onRegenerate={() => regenerate(item)}
									/>

									{/* {product && (
										<ProductCard
											product={product}
											productCode={item.productCode!}
										/>
									)} */}
								</View>
							);
						}}
						ListHeaderComponent={
							loadingOlder ? (
								<ActivityIndicator
									style={{ paddingVertical: 12 }}
									color="#666"
								/>
							) : null
						}
						ListFooterComponent={
							<>
								{isTyping && (
									<View style={styles.typingContainer}>
										<ActivityIndicator size="small" color={Colors.blueDark} />

										<Text style={styles.typingText}>
											Searching HPCL knowledge base...
										</Text>
									</View>
								)}
								{searchFailure && (
									<SearchFailureCard
										message={searchFailure.message}
										variant={searchFailure.type}
										onRetry={handleRetry}
										onEdit={handleEdit}
									/>
								)}
								{regenerateError && (
									<View style={styles.regenerateErrorContainer}>
										<Ionicons name="alert-circle" size={20} color="#DC2626" />
										<Text style={styles.regenerateErrorText}>
											Request Failed, Please retry or try again later
										</Text>
									</View>
								)}
								<RelatedProducts />

								<Image
									source={ALL_IMAGES.HAPPINESS_ICON}
									style={styles.happiness}
								/>
							</>
						}
					/>
				</View>
				{showScrollToLatest && (
					<TouchableOpacity
						style={styles.scrollToLatestButton}
						onPress={handleScrollToLatestPress}
						accessibilityRole="button"
						accessibilityLabel="Scroll to latest message"
					>
						<MaterialIcons name="south" size={22} color={Colors.white} />
						<Text style={styles.scrollToLatestText}>Latest</Text>
					</TouchableOpacity>
				)}
				<LoadingOverlay visible={loading} text="Thinking..." />
				<InputSearch
					mode="continue"
					localChatId={chatLocalId}
					onMessageAdded={() => {
						loadRecentMessages();
					}}
					setLoading={setLoading}
					setSlowNet={setSlowNet}
					isOnline={isOnline}
					isSearching={isTyping}
					onStop={handleStopSearch}
					draftText={editDraft}
					onDraftTextApplied={() => setEditDraft(null)}
				/>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ResultScreen;

const styles = StyleSheet.create({
	happiness: {
		height: 100,
		width: 130,
		resizeMode: "contain",
		marginTop: 20,
		alignSelf: "flex-end",
	},
	typingContainer: {
		alignSelf: "flex-start",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F5F7FA",
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 18,
		marginTop: 10,
		marginBottom: 8,
		marginLeft: 10,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},

	typingText: {
		marginLeft: 10,
		fontSize: 14,
		color: "#555",
	},
	regenerateErrorContainer: {
		width: "98%",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FEE2E2",
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 12,
		marginTop: 10,
		marginBottom: 8,
		marginHorizontal: "1%",
		borderWidth: 1,
		borderColor: "#FECACA",
	},
	regenerateErrorText: {
		marginLeft: 10,
		fontSize: 13,
		color: "#DC2626",
		flex: 1,
	},
	scrollToLatestButton: {
		position: "absolute",
		right: 18,
		bottom: 132,
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: Colors.blueDeep,
		paddingHorizontal: 14,
		height: 46,
		borderRadius: 23,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.22,
		shadowRadius: 10,
		elevation: 6,
		zIndex: 20,
	},
	scrollToLatestText: {
		color: Colors.white,
		fontSize: 14,
		fontWeight: "700",
	},
});
