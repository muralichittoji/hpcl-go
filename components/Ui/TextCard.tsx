import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
	label: string;
	onPress: () => void;
	backgroundColor: string;
	height: number;
	width: number;
};

const TextCard = ({
	label,
	onPress,
	backgroundColor,
	height,
	width,
}: Props) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.onlyItem, { backgroundColor, height, width }]}
		>
			<Text style={styles.onlyText}>{label}</Text>
		</TouchableOpacity>
	);
};

export default TextCard;

const styles = StyleSheet.create({
	onlyItem: {
		justifyContent: "space-around",
		alignItems: "center",
		borderRadius: 10,
		paddingHorizontal: 10,
		margin: 5,
		shadowColor: "#444",
		shadowOpacity: 0.3,
		shadowRadius: 3,
		shadowOffset: { width: 1, height: 1 },
	},
	onlyText: {
		textAlign: "center",
		color: "white",
		fontWeight: "700",
		fontSize: 22,
	},
});
