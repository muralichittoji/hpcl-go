import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Alert, Share, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
	answer: string;
	onRegenerate?: () => void;
};

const AIActions = ({ answer, onRegenerate }: Props) => {
	const copyAnswer = async () => {
		await Clipboard.setStringAsync(answer);
		Alert.alert("Copied", "Answer copied to clipboard.");
	};

	const shareAnswer = async () => {
		try {
			await Share.share({
				message: answer,
			});
		} catch {}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.button}>
				<Ionicons name="thumbs-up-outline" size={20} color={Colors.blueDark} />
			</TouchableOpacity>

			<TouchableOpacity style={styles.button}>
				<Ionicons
					name="thumbs-down-outline"
					size={20}
					color={Colors.blueDark}
				/>
			</TouchableOpacity>

			<TouchableOpacity style={styles.button} onPress={copyAnswer}>
				<Ionicons name="copy-outline" size={20} color={Colors.blueDark} />
			</TouchableOpacity>

			<TouchableOpacity style={styles.button} onPress={shareAnswer}>
				<Ionicons
					name="share-social-outline"
					size={20}
					color={Colors.blueDark}
				/>
			</TouchableOpacity>

			<TouchableOpacity style={styles.button} onPress={onRegenerate}>
				<Ionicons name="refresh-outline" size={20} color={Colors.blueDark} />
			</TouchableOpacity>
		</View>
	);
};

export default AIActions;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginLeft: 50,
		marginTop: 10,
		marginBottom: 20,
	},

	button: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: "#F4F5F7",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
});
