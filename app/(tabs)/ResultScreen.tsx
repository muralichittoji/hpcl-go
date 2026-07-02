import Header from "@/components/Ui/Header";
import devData from "@/constants/Data";
import { ProductData } from "@/hooks/types";

import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { getAnswer } from "@/utils/authService";
import {
	getOlderMessagesPage,
	getPreviousUserMessage,
	getRecentMessagesPage,
	Message,
	updateMessage,
} from "@/lib/chat";
import { safeParse } from "@/utils/jsonUtils";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	FlatList,
	Image,
	StyleSheet,
	View,
} from "react-native";
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

	const scrollToBottom = () => {
		scrollRef.current?.scrollToEnd({
			animated: true,
		});
	};

	const [loading, setLoading] = useState(false);
	const [slowNet, setSlowNet] = useState(false);

	const chatLocalId = Number(params.chatLocalId);

	const [messages, setMessages] = useState<Message[]>([]);
	const [hasMoreOlder, setHasMoreOlder] = useState(false);
	const [loadingOlder, setLoadingOlder] = useState(false);

	const loadRecentMessages = useCallback(() => {
		if (!chatLocalId) return;

		const { items, hasMore } = getRecentMessagesPage(chatLocalId);
		setMessages(items);
		setHasMoreOlder(hasMore);
	}, [chatLocalId]);

	const loadOlderMessages = useCallback(() => {
		if (!chatLocalId || loadingOlder || !hasMoreOlder || messages.length === 0) {
			return;
		}

		setLoadingOlder(true);

		try {
			const oldestId = messages[0].id;
			const { items, hasMore } = getOlderMessagesPage(
				chatLocalId,
				oldestId,
			);

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

	const getProduct = (key?: string): ProductData | null => {
		if (!key) return null;
		return devData[key as keyof typeof devData] ?? null;
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

			const userMessage = getPreviousUserMessage(assistantMessage.id);

			if (!userMessage) {
				console.log("User message not found");
				return;
			}

			const res = await getAnswer({
				question: userMessage.text,
			});

			const rawAnswer = res?.results?.[0]?.answer;

			if (!rawAnswer) {
				console.log("No regenerated answer received.");
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
		} catch (error) {
			console.log("Regenerate Error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={{ flex: 1 }}>
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
							? getProduct(item.productCode)
							: null;

						return (
							<View>
								<AIMessage
									answer={item.text}
									animate={index === messages.length - 1}
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
				onMessageAdded={loadRecentMessages}
				setLoading={setLoading}
				setSlowNet={setSlowNet}
			/>
		</View>
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
});
