import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type Props = {
	visible: boolean;

	title?: string;
	message?: string;

	icon?: keyof typeof Ionicons.glyphMap;
	iconColor?: string;

	buttonText?: string;
	onPress?: () => void;
};

export default function CommonModal({
	visible,
	title = "Something went wrong",
	message = "Please try again",
	icon = "alert-circle-outline",
	iconColor = "#1E3A8A",
	buttonText = "OK",
	onPress,
}: Props) {
	const scaleAnim = useRef(new Animated.Value(0.8)).current;

	useEffect(() => {
		if (visible) {
			scaleAnim.setValue(0.8);

			Animated.spring(scaleAnim, {
				toValue: 1,
				useNativeDriver: true,
			}).start();
		}
	}, [visible]);

	return (
		<Modal transparent visible={visible} animationType="fade">
			<View style={styles.overlay}>
				<Animated.View
					style={[styles.box, { transform: [{ scale: scaleAnim }] }]}
				>
					<Ionicons name={icon} size={42} color={iconColor} />

					<Text style={styles.title}>{title}</Text>
					<Text style={styles.subtitle}>{message}</Text>

					<TouchableOpacity style={styles.button} onPress={onPress}>
						<Text style={styles.buttonText}>{buttonText}</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	box: {
		width: 270,
		backgroundColor: "#fff",
		borderRadius: 18,
		padding: 24,
		alignItems: "center",
		elevation: 8,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		marginTop: 10,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		color: "#666",
		marginTop: 6,
		textAlign: "center",
	},
	button: {
		marginTop: 18,
		backgroundColor: "#1E3A8A",
		paddingVertical: 10,
		paddingHorizontal: 28,
		borderRadius: 10,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
	},
});
