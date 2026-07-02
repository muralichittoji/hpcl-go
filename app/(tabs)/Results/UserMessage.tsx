import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
	question: string;
};

const UserMessage = ({ question }: Props) => {
	return (
		<View style={styles.container}>
			<View style={styles.bubble}>
				<Text style={styles.message}>{question}</Text>
			</View>

			<View style={styles.avatar}>
				<Ionicons name="person" size={22} color="#FFF" />
			</View>
		</View>
	);
};

export default UserMessage;

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		marginBottom: 15,
		alignItems: "flex-end",
	},

	bubble: {
		maxWidth: "82%",
		backgroundColor: Colors.blueDeep,
		paddingHorizontal: 18,
		paddingVertical: 8,
		borderRadius: 22,
		borderBottomRightRadius: 6,
	},

	title: {
		color: "#DCEEFF",
		fontWeight: "700",
		fontSize: 12,
		marginBottom: 5,
	},

	message: {
		color: "#FFF",
		fontSize: 16,
		lineHeight: 24,
	},

	avatar: {
		marginTop: 6,
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: Colors.blueDark,
		alignItems: "center",
		justifyContent: "center",
	},
});
