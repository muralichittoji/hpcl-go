import { Colors } from "@/constants/theme";
import { ProductData } from "@/hooks/types";
import { getProduct } from "@/lib/products";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
	answer: string;
	speed?: number;
	animate?: boolean;

	onTyping?: () => void;
	onTypingComplete?: () => void;

	onProductPress?: (productCode: string) => void;
};

type RichPart = {
	text: string;
	productCode?: string;
	product?: ProductData;
};

const CURSOR_BLINK_MS = 450;

function useTypewriter(
	text: string,
	animate: boolean,
	speedMs: number,
	onTyping?: () => void,
	onTypingComplete?: () => void,
) {
	const [displayText, setDisplayText] = useState(animate ? "" : text);
	const [isTyping, setIsTyping] = useState(animate);

	const onTypingRef = useRef(onTyping);
	const onTypingCompleteRef = useRef(onTypingComplete);

	onTypingRef.current = onTyping;
	onTypingCompleteRef.current = onTypingComplete;
	const hasAnimated = useRef(false);
	useEffect(() => {
		if (!animate || hasAnimated.current) {
			setDisplayText(text);
			setIsTyping(false);
			return;
		}

		hasAnimated.current = true;

		setDisplayText("");
		setIsTyping(true);

		const tokens = text.match(/\S+|\s+/g) ?? [text];
		let index = 0;

		const interval = setInterval(() => {
			index += 1;
			setDisplayText(tokens.slice(0, index).join(""));

			onTypingRef.current?.();

			if (index >= tokens.length) {
				clearInterval(interval);
				setIsTyping(false);
				onTypingCompleteRef.current?.();
			}
		}, speedMs);

		return () => clearInterval(interval);
	}, [animate, speedMs, text]);

	return { displayText, isTyping };
}

function useCursorBlink(active: boolean) {
	const [visible, setVisible] = useState(active);

	useEffect(() => {
		if (!active) {
			setVisible(false);
			return;
		}

		setVisible(true);

		const interval = setInterval(() => {
			setVisible((value) => !value);
		}, CURSOR_BLINK_MS);

		return () => clearInterval(interval);
	}, [active]);

	return visible;
}

const AIMessage = ({
	answer,
	speed = 7,
	onTyping,
	onTypingComplete,
	onProductPress,
	animate = true,
}: Props) => {
	// Some API responses return a JSON string containing { response, app_product_code }
	let parsedAnswer = answer;
	let appProductCodeFromApi: string | undefined;
	try {
		const maybe = JSON.parse(answer);
		if (maybe && typeof maybe === "object") {
			if (typeof maybe.response === "string") parsedAnswer = maybe.response;
			appProductCodeFromApi =
				maybe.app_product_code ?? maybe.appProductCode ?? maybe.appProductcode;
		}
	} catch (e) {
		// Answer is not JSON - this is expected for plain text responses
		// Suppress repeated error logs - they're not actionable
	}

	const { displayText, isTyping } = useTypewriter(
		parsedAnswer,
		animate,
		speed,
		onTyping,
		onTypingComplete,
	);
	const showCursor = useCursorBlink(isTyping);
	const PRODUCT_CODE_REGEX = /(HPCL-[A-Z]+-\d{4})/g;

	function escapeRegExp(str: string) {
		return str.replace(/[.*+?^${}()|[\]\\\\]/g, "\\$&");
	}

	const buildParts = (response: string): RichPart[] => {
		const parts: RichPart[] = [];
		const foundProducts: { code: string; product: ProductData }[] = [];

		let currentIndex = 0;
		let match: RegExpExecArray | null;

		// First pass: find codes and create placeholder parts (skip showing codes)
		while ((match = PRODUCT_CODE_REGEX.exec(response)) !== null) {
			const productCode = match[1];
			const product = getProduct(productCode);
			if (!product) continue;

			foundProducts.push({ code: productCode, product });

			const codeStart = match.index;
			let codeEnd = codeStart + match[0].length;

			// If there's a closing parenthesis right after the code, skip it too
			if (response[codeEnd] === ")") {
				codeEnd += 1;
			}

			// Check if the product title appears immediately before the code (e.g. "Title (CODE)")
			const beforeSliceStart = Math.max(0, currentIndex);
			const beforeSlice = response.slice(beforeSliceStart, codeStart);
			const titleIndexInBefore = beforeSlice.lastIndexOf(product.title);

			if (titleIndexInBefore !== -1) {
				// There is a title in the nearby before-slice. Determine absolute index.
				const titleStart = beforeSliceStart + titleIndexInBefore;
				const between = response.slice(
					titleStart + product.title.length,
					codeStart,
				);
				// If between contains only whitespace and optional '(' then treat as Title(Code)
				if (/^\s*\(?\s*$/.test(between)) {
					if (titleStart > currentIndex) {
						parts.push({ text: response.slice(currentIndex, titleStart) });
					}
					parts.push({ text: product.title, productCode, product });
					currentIndex = codeEnd;
					continue;
				}
			}

			// Default: no preceding title, replace the code (and optional surrounding parentheses) with the product title link
			if (codeStart > currentIndex) {
				parts.push({ text: response.slice(currentIndex, codeStart) });
			}
			parts.push({ text: product.title, productCode, product });
			currentIndex = codeEnd;
		}

		// Push remaining text after last match
		if (currentIndex < response.length) {
			parts.push({ text: response.slice(currentIndex) });
		}

		// If no product codes were found, just return the whole response as a single part
		if (parts.length === 0) {
			parts.push({ text: response });
			return parts;
		}

		// Second pass: within plain text parts, replace any occurrences of found product titles with link parts
		if (foundProducts.length > 0) {
			const finalParts: RichPart[] = [];
			for (const part of parts) {
				if (part.productCode) {
					finalParts.push(part);
					continue;
				}

				let text = part.text;
				if (!text) continue;

				// For each discovered product, split text by its title occurrences
				for (const { code, product } of foundProducts) {
					const title = product.title;
					const esc = escapeRegExp(title);
					const re = new RegExp(esc, "g");
					let matchIndex: RegExpExecArray | null;
					let lastIndex = 0;
					const segments: RichPart[] = [];

					while ((matchIndex = re.exec(text)) !== null) {
						const idx = matchIndex.index;
						if (idx > lastIndex) {
							segments.push({ text: text.slice(lastIndex, idx) });
						}
						segments.push({ text: title, productCode: code, product });
					}

					if (segments.length > 0) {
						if (lastIndex < text.length) {
							segments.push({ text: text.slice(lastIndex) });
						}
						// Replace text with the joined segments for next product processing
						text = segments.map((s) => s.text).join("");
						// But push segments into a buffer to be processed after all products
						finalParts.push(...segments.map((s) => (s.product ? s : s)));
						// continue to next part since we've already emitted segments
						text = "";
						break;
					}
				}

				if (text) {
					finalParts.push({ text });
				}
			}

			return finalParts;
		}

		return parts;
	};

	const parts = buildParts(displayText);

	// If API provided an app_product_code separately, ensure it's shown as a linked title
	if (appProductCodeFromApi) {
		const product = getProduct(appProductCodeFromApi);
		if (product) {
			const alreadyShown = parts.some(
				(p) => p.productCode === appProductCodeFromApi,
			);
			if (!alreadyShown) {
				// Prepend product title as a link followed by a separator
				parts.unshift({ text: ": " });
				parts.unshift({
					text: product.title,
					productCode: appProductCodeFromApi,
					product,
				});
			}
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.avatar}>
				<Ionicons name="sparkles" size={20} color={Colors.white} />
			</View>

			<View style={styles.bubble}>
				<Text style={styles.label}>Assistant</Text>
				<Text style={styles.message}>
					{parts.map((part, index) => {
						if (part.productCode) {
							return (
								<Text
									key={index}
									style={styles.productLink}
									onPress={() => onProductPress?.(part.productCode!)}
								>
									{part.text}
								</Text>
							);
						}

						return <Text key={index}>{part.text}</Text>;
					})}

					{showCursor && <Text style={styles.cursor}>|</Text>}
				</Text>
			</View>
		</View>
	);
};

export default memo(AIMessage);

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 20,
		maxWidth: "92%",
	},

	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.blueLight,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},

	bubble: {
		flex: 1,
		backgroundColor: Colors.white,
		borderRadius: 22,
		borderTopLeftRadius: 6,
		paddingHorizontal: 18,
		paddingVertical: 14,
		elevation: 4,
		shadowColor: Colors.black,
		shadowOpacity: 0.08,
		shadowRadius: 6,
		shadowOffset: {
			width: 0,
			height: 2,
		},
	},

	label: {
		fontSize: 12,
		fontWeight: "700",
		color: Colors.blueDeep,
		marginBottom: 6,
	},

	message: {
		fontSize: 15,
		lineHeight: 24,
		color: "#333",
	},

	cursor: {
		color: Colors.blueDeep,
		fontWeight: "700",
	},

	productLink: {
		color: Colors.blueDeep,
		fontWeight: "700",
		textDecorationLine: "underline",
	},
});
