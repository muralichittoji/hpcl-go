import Header from "@/components/Ui/Header";
import devData from "@/constants/Data";
import { ProductData } from "@/hooks/types";
import { getHistoryById } from "@/utils/historyRepository";

import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Animated, Image, ScrollView, StyleSheet, View } from "react-native";
import AIMessage from "./Results/AIMessage";
import ProductCard from "./Results/ProductCard";
import RelatedProducts from "./Results/RelatedProducts";
import UserMessage from "./Results/UserMessage";

const ResultScreen = () => {
	const params = useLocalSearchParams();
	const scrollRef = useRef<ScrollView>(null);
	const scrollY = useRef(new Animated.Value(0)).current;

	const scrollToBottom = () => {
		scrollRef.current?.scrollToEnd({
			animated: true,
		});
	};

	const [loading, setLoading] = useState(false);
	const [slowNet, setSlowNet] = useState(false);

	const historyId = Number(params.historyId);

	const history = getHistoryById(historyId);

	const question = history?.question ?? "";

	const answer = history?.response ?? "";

	const productCode = history?.productCode ?? undefined;
	const getProduct = (key?: string): ProductData | null => {
		if (!key) return null;
		return devData[key as keyof typeof devData] ?? null;
	};
	const product = getProduct(productCode);

	console.log("History ID:", historyId);
	// console.log("History Item:", historyItem);
	console.log("Question:", question);
	console.log("Answer:", answer);
	console.log("product code", productCode);

	return (
		<View style={{ flex: 1 }}>
			<Header caption="Results Screen" scrollY={scrollY} />
			<View style={{ flex: 1 }}>
				<Animated.ScrollView
					ref={scrollRef}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					scrollEventThrottle={16}
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
				>
					<UserMessage question={question} />

					<AIMessage answer={answer} onTyping={scrollToBottom} />

					{product && productCode && (
						<ProductCard product={product} productCode={productCode} />
					)}

					<RelatedProducts />

					{/* Feedback */}
					<Image source={ALL_IMAGES.HAPPINESS_ICON} style={styles.happiness} />
				</Animated.ScrollView>
			</View>
			<LoadingOverlay visible={loading} text="Thinking..." />
			<InputSearch setLoading={setLoading} setSlowNet={setSlowNet} />
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
