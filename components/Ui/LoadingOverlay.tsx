import React, { useEffect, useRef } from "react";
import {
	ActivityIndicator,
	Animated,
	StyleSheet,
	Text,
	View,
} from "react-native";

type Props = {
	visible: boolean;
	text?: string;
};

export default function LoadingOverlay({
	visible,
	text = "Loading...",
}: Props) {
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	}, [visible, fadeAnim]);

	if (!visible) return null;

	return (
		<Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
			<View style={styles.box}>
				<ActivityIndicator size="large" color="#1E3A8A" />
				<Text style={styles.text}>{text}</Text>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 999,
	},
	box: {
		backgroundColor: "#ddd",
		padding: 20,
		borderRadius: 12,
		alignItems: "center",
		width: 260,
	},
	text: {
		marginTop: 10,
		fontSize: 14,
		color: "#333",
	},
	percent: {
		marginTop: 8,
		fontSize: 14,
		fontWeight: "600",
		color: "#1E3A8A",
	},
});
