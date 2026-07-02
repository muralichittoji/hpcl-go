import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
	answer: string;
	speed?: number;
	onTyping?: () => void;
	onTypingComplete?: () => void;
};

const AIMessage = ({
	answer,
	speed = 7,
	onTyping,
	onTypingComplete,
}: Props) => {
	const [displayText, setDisplayText] = useState("");
	const [showCursor, setShowCursor] = useState(true);

	useEffect(() => {
		const cursor = setInterval(() => {
			setShowCursor((v) => !v);
		}, 450);

		return () => clearInterval(cursor);
	}, []);

	useEffect(() => {
		setDisplayText("");

		const words = answer.split(" ");

		let index = 0;

		const interval = setInterval(() => {
			index++;

			setDisplayText(words.slice(0, index).join(" "));

			onTyping?.();

			if (index >= words.length) {
				clearInterval(interval);
			}
		}, speed);

		return () => clearInterval(interval);
	}, [answer]);

	return (
		<View style={styles.container}>
			<View style={styles.avatar}>
				<Ionicons name="sparkles" size={20} color="#FFF" />
			</View>

			<View style={{ paddingHorizontal: 10, paddingRight: 20 }}>
				<Text style={styles.message}>
					{displayText}
					{showCursor && <Text style={styles.cursor}>|</Text>}
				</Text>
			</View>
		</View>
	);
};

export default AIMessage;

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		alignItems: "flex-start",
		marginBottom: 20,
		gap: 5,
	},

	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.blueLight,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},

	bubble: {
		flex: 1,
		backgroundColor: "#FFF",
		borderRadius: 22,
		borderTopLeftRadius: 6,
		marginHorizontal: 5,
		paddingHorizontal: 18,
		paddingVertical: 16,
		elevation: 4,
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 6,
		shadowOffset: {
			width: 0,
			height: 2,
		},
	},

	title: {
		fontSize: 13,
		fontWeight: "700",
		color: Colors.blueDeep,
		marginBottom: 8,
	},

	message: {
		fontSize: 14,
		lineHeight: 26,
		color: "#333",
		textAlign: "justify",
	},

	cursor: {
		color: Colors.blueDeep,
		fontWeight: "700",
	},
});
