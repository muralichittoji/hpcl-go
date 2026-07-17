import Header from "@/components/Ui/Header";
import { ProductData } from "@/hooks/types";
import { getProduct } from "@/lib/products";

import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import {
	addMessage,
	deleteMessage,
	getOlderMessagesPage,
	getPreviousUserMessage,
	getRecentMessagesPage,
	Message,
	updateChatId,
	updateMessage,
} from "@/lib/chat";
import { addNotification } from "@/lib/notification";
import { showSearchCompletedNotification } from "@/lib/pushNotifications";
import { getApiErrorMessage, isAbortError } from "@/utils/apiErrors";
import { getAnswer } from "@/utils/authService";
import { safeParse } from "@/utils/jsonUtils";
import { useNetwork } from "@/utils/NetworkProvider";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	FlatList,
	Image,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
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

	const [loading, setLoading] = useState(false);
	const [, setSlowNet] = useState(false);
	const isAsking = useRef(false);
	const lastUserMessageRef = useRef<string | null>(null);
	const lastAskedMessageIdRef = useRef<number | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

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

	const getLastUserMessage = () => {
		if (!messages.length) return null;

		const last = messages[messages.length - 1];

		return last.role === "user" ? last : null;
	};

	const askQuestion = async () => {
		const userMessage = getLastUserMessage();

		if (!userMessage || isAsking.current) return;

		if (lastAskedMessageIdRef.current === userMessage.id) return;

		if (!isOnline) {
			setSearchFailure({
				type: "error",
				message: "No internet connection. Check your network and try again.",
				userMessageId: userMessage.id,
				userMessageText: userMessage.text,
			});
			return;
		}

		lastUserMessageRef.current = userMessage.text;
		lastAskedMessageIdRef.current = userMessage.id;
		isAsking.current = true;
		setIsTyping(true);
		setSearchFailure(null);
		setRegenerateError(null);

		abortControllerRef.current?.abort();
		abortControllerRef.current = new AbortController();

		try {
			const res = await getAnswer({
				question: userMessage.text,
				signal: abortControllerRef.current.signal,
			});

			const rawAnswer = res?.results?.[0]?.answer;

			if (!rawAnswer) {
				const errorMsg = "No answer received from server.";
				console.log(errorMsg);
				lastAskedMessageIdRef.current = null;
				setSearchFailure({
					type: "error",
					message: "Network Failure, Please wait or try again later",
					userMessageId: userMessage.id,
					userMessageText: userMessage.text,
				});
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
				lastAskedMessageIdRef.current = null;
				setSearchFailure({
					type: "error",
					message: errorMsg,
					userMessageId: userMessage.id,
					userMessageText: userMessage.text,
				});
				return;
			}

			const parsed = safeParse(rawAnswer);

			const finalResponse =
				parsed?.response ?? rawAnswer ?? "No response available";

			const productCode = parsed?.app_product_code ?? null;

			// Save assistant message
			addMessage(
				chatLocalId,
				"assistant",
				finalResponse,
				productCode,
				res?.results?.[0]?.queryId ?? null,
			);

			addNotification(
				chatLocalId,
				"Search Complete",
				userMessage.text,
				"success",
			);

			showSearchCompletedNotification(
				chatLocalId,
				"Search Complete",
				userMessage.text,
			);

			// Save server chat id if available
			if (res?.chatId) {
				updateChatId(chatLocalId, res.chatId);
			}

			// Refresh UI
			loadRecentMessages();
		} catch (e: unknown) {
			if (isAbortError(e)) {
				lastAskedMessageIdRef.current = null;
				setSearchFailure({
					type: "stopped",
					message: "Search stopped by user.",
					userMessageId: userMessage.id,
					userMessageText: userMessage.text,
				});
				return;
			}

			const errorMsg = getApiErrorMessage(e, isOnline);
			console.log("Search Error:", e);
			lastAskedMessageIdRef.current = null;
			setSearchFailure({
				type: "error",
				message: errorMsg,
				userMessageId: userMessage.id,
				userMessageText: userMessage.text,
			});
		} finally {
			setIsTyping(false);
			isAsking.current = false;
			abortControllerRef.current = null;
		}
	};

	const handleStopSearch = () => {
		abortControllerRef.current?.abort();
	};

	const handleRetry = async () => {
		setSearchFailure(null);
		lastAskedMessageIdRef.current = null;
		await askQuestion();
	};

	const handleEdit = () => {
		if (!searchFailure) return;

		setEditDraft(searchFailure.userMessageText);
		deleteMessage(searchFailure.userMessageId);
		lastAskedMessageIdRef.current = null;
		setSearchFailure(null);
		loadRecentMessages();
	};

	// Ask whenever the latest message is an unanswered user message.
	useEffect(() => {
		const lastUser = getLastUserMessage();
		if (!lastUser) return;

		if (searchFailure && lastUser.id !== searchFailure.userMessageId) {
			setSearchFailure(null);
		}

		if (searchFailure) return;
		if (isAsking.current) return;
		if (lastUser.id === lastAskedMessageIdRef.current) return;

		askQuestion();
	}, [messages, searchFailure, isOnline]);

	useEffect(() => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = null;
		isAsking.current = false;
		lastAskedMessageIdRef.current = null;
		lastUserMessageRef.current = null;
		setSearchFailure(null);
		setEditDraft(null);
		setRegenerateError(null);
		setIsTyping(false);
	}, [chatLocalId]);

	const loadRecentMessages = useCallback(() => {
		if (!chatLocalId) return [];

		const { items, hasMore } = getRecentMessagesPage(chatLocalId);

		setMessages(items);
		setHasMoreOlder(hasMore);

		return items;
	}, [chatLocalId]);

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

	const getProductByCode = (key?: string): ProductData | null => {
		if (!key) return null;
		return getProduct(key);
	};

	const previousCount = useRef(0);

	useEffect(() => {
		if (messages.length > previousCount.current) {
			setTimeout(() => {
				scrollRef.current?.scrollToEnd({
					animated: true,
				});
			}, 50);
		}

		previousCount.current = messages.length;
	}, [messages]);

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
							},
						)}
						renderItem={({ item, index }) => {
							if (item.role === "user") {
								return <UserMessage question={item.text} />;
							}

							const product = item.productCode
								? getProductByCode(item.productCode)
								: null;

							return (
								<View>
									<AIMessage
										answer={item.text}
										animate={index === messages.length - 1}
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
				<LoadingOverlay visible={loading} text="Thinking..." />
				<InputSearch
					mode="continue"
					localChatId={chatLocalId}
					onMessageAdded={() => {
						loadRecentMessages();
					}}
					setLoading={setLoading}
					setSlowNet={setSlowNet}
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
});
