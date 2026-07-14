import Header from "@/components/Ui/Header";
import { ProductData } from "@/hooks/types";
import { getProduct } from "@/lib/products";

import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import {
	addMessage,
	getOlderMessagesPage,
	getPreviousUserMessage,
	getRecentMessagesPage,
	Message,
	updateChatId,
	updateMessage,
} from "@/lib/chat";
import { addNotification } from "@/lib/notification";
import { getAnswer } from "@/utils/authService";
import { safeParse } from "@/utils/jsonUtils";
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
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AIActions from "./Results/AIActions";
import AIMessage from "./Results/AIMessage";
import ProductCard from "./Results/ProductCard";
import RelatedProducts from "./Results/RelatedProducts";
import UserMessage from "./Results/UserMessage";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Message>);

const ResultScreen = () => {
	const params = useLocalSearchParams();
	const scrollRef = useRef<FlatList<Message>>(null);
	const scrollY = useRef(new Animated.Value(0)).current;

	const [loading, setLoading] = useState(false);
	const [, setSlowNet] = useState(false);
	const hasAutoAsked = useRef(false);
	const isAsking = useRef(false); // Prevent duplicate requests
	const lastUserMessageRef = useRef<string | null>(null); // Track for retry
	const previousMessagesLengthRef = useRef(0);

	const chatLocalId = Number(params.chatLocalId);

	const [messages, setMessages] = useState<Message[]>([]);
	const [hasMoreOlder, setHasMoreOlder] = useState(false);
	const [loadingOlder, setLoadingOlder] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const autoAsk = params.autoAsk === "1";

	const getLastUserMessage = () => {
		if (!messages.length) return null;

		const last = messages[messages.length - 1];

		return last.role === "user" ? last : null;
	};

	const askQuestion = async () => {
		const userMessage = getLastUserMessage();

		if (!userMessage || isAsking.current) return; // Prevent duplicate requests

		lastUserMessageRef.current = userMessage.text; // Save for retry
		isAsking.current = true;
		setIsTyping(true);
		setError(null);

		try {
			const res = await getAnswer({
				question: userMessage.text,
			});

			const rawAnswer = res?.results?.[0]?.answer;

			if (!rawAnswer) {
				const errorMsg = "No answer received from server.";
				console.log(errorMsg);
				setError(errorMsg);
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
				setError(errorMsg);
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

			// Save server chat id if available
			if (res?.chatId) {
				updateChatId(chatLocalId, res.chatId);
			}

			// Refresh UI
			loadRecentMessages();
		} catch (e: any) {
			let errorMsg = "Failed to get answer. Please try again.";

			// Check for specific error types
			if (e?.message?.includes("API Error:")) {
				errorMsg = "Backend returned an error. Please try again.";
			} else if (e?.response?.status === 502) {
				errorMsg =
					"Server is temporarily unavailable (502). Please try again in a moment.";
			} else if (e?.message?.includes("timeout")) {
				errorMsg =
					"Request timed out. Please check your connection and try again.";
			} else if (e?.message?.includes("Invalid API response")) {
				errorMsg = "Received invalid response from server. Please try again.";
			}

			console.log("Search Error:", e);
			setError(errorMsg);
		} finally {
			setIsTyping(false);
			isAsking.current = false;
		}
	};

	const handleRetry = async () => {
		setError(null);
		await askQuestion();
	};

	useEffect(() => {
		if (!autoAsk) return;

		if (hasAutoAsked.current) return;

		if (!messages.length) return;

		const last = getLastUserMessage();

		if (!last) return;

		hasAutoAsked.current = true;
		previousMessagesLengthRef.current = messages.length;

		askQuestion();
	}, [messages, autoAsk]);

	// Handle subsequent user messages added manually via InputSearch
	useEffect(() => {
		// Only process if we've already done the initial auto-ask
		if (!hasAutoAsked.current) return;

		// Check if a new user message was added
		if (messages.length <= previousMessagesLengthRef.current) return;

		const last = getLastUserMessage();

		if (!last) return;

		previousMessagesLengthRef.current = messages.length;
		askQuestion();
	}, [messages]);

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
			setError(null);

			const userMessage = getPreviousUserMessage(assistantMessage.id);

			if (!userMessage) {
				const errorMsg = "User message not found";
				console.log(errorMsg);
				setError(errorMsg);
				return;
			}

			const res = await getAnswer({
				question: userMessage.text,
			});

			const rawAnswer = res?.results?.[0]?.answer;

			if (!rawAnswer) {
				const errorMsg = "No regenerated answer received.";
				console.log(errorMsg);
				setError(errorMsg);
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
				setError(errorMsg);
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
		} catch (error: any) {
			let errorMsg = "Failed to regenerate answer. Please try again.";

			// Check for specific error types
			if (error?.message?.includes("API Error:")) {
				errorMsg = "Backend returned an error. Please try again.";
			} else if (error?.response?.status === 502) {
				errorMsg =
					"Server is temporarily unavailable (502). Please try again in a moment.";
			} else if (error?.message?.includes("timeout")) {
				errorMsg =
					"Request timed out. Please check your connection and try again.";
			} else if (error?.message?.includes("Invalid API response")) {
				errorMsg = "Received invalid response from server. Please try again.";
			}

			console.log("Regenerate Error:", error);
			setError(errorMsg);
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

									{product && (
										<ProductCard
											product={product}
											productCode={item.productCode!}
										/>
									)}
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
								{error && (
									<View style={styles.errorContainer}>
										<Ionicons name="alert-circle" size={20} color="#EF4444" />
										<Text style={styles.errorText}>{error}</Text>
										<TouchableOpacity
											style={styles.retryButton}
											onPress={handleRetry}
										>
											<Text style={styles.retryButtonText}>Retry</Text>
										</TouchableOpacity>
										<TouchableOpacity onPress={() => setError(null)}>
											<Text style={styles.errorDismiss}>✕</Text>
										</TouchableOpacity>
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
	errorContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FEE2E2",
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 12,
		marginTop: 10,
		marginBottom: 8,
		marginLeft: 10,
		marginRight: 10,
		borderWidth: 1,
		borderColor: "#FECACA",
	},
	errorText: {
		marginLeft: 10,
		fontSize: 13,
		color: "#DC2626",
		flex: 1,
	},
	retryButton: {
		backgroundColor: "#DC2626",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		marginLeft: 10,
	},
	retryButtonText: {
		color: "white",
		fontSize: 12,
		fontWeight: "600",
	},
	errorDismiss: {
		fontSize: 18,
		color: "#DC2626",
		fontWeight: "bold",
		marginLeft: 10,
	},
});
