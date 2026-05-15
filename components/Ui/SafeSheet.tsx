import React, { useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	Easing,
	KeyboardAvoidingView,
	PanResponder,
	Platform,
	Pressable,
	StyleSheet,
	View,
} from "react-native";

const { height } = Dimensions.get("window");

type Props = {
	visible: boolean;
	onClose: () => void;
	children: React.ReactNode;
	heightRatio?: number;
};

const SafeSheet = ({
	visible,
	onClose,
	children,
	heightRatio = 0.53,
}: Props) => {
	const SHEET_HEIGHT = height * heightRatio;
	const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

	const smoothEasing = Easing.bezier(0.22, 1, 0.36, 1);

	useEffect(() => {
		if (visible) {
			Animated.timing(translateY, {
				toValue: 0,
				duration: 350,
				easing: smoothEasing,
				useNativeDriver: true,
			}).start();
		}
	}, [smoothEasing, translateY, visible]);

	const closeSheet = () => {
		Animated.timing(translateY, {
			toValue: SHEET_HEIGHT,
			duration: 300,
			easing: smoothEasing,
			useNativeDriver: true,
		}).start(onClose);
	};

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
			onPanResponderMove: (_, g) => {
				if (g.dy > 0) translateY.setValue(g.dy);
			},
			onPanResponderRelease: (_, g) => {
				if (g.dy > 120) closeSheet();
				else
					Animated.timing(translateY, {
						toValue: 0,
						duration: 250,
						easing: smoothEasing,
						useNativeDriver: true,
					}).start();
			},
		}),
	).current;

	if (!visible) return null;

	return (
		<View style={StyleSheet.absoluteFill}>
			{/* Overlay */}
			<Pressable style={styles.overlay} onPress={closeSheet} />

			{/* Sheet */}
			<Animated.View
				style={[
					styles.sheet,
					{ height: SHEET_HEIGHT, transform: [{ translateY }] },
				]}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={{ flex: 1 }}
				>
					<View style={styles.handle} {...panResponder.panHandlers} />
					{children}
				</KeyboardAvoidingView>
			</Animated.View>
		</View>
	);
};

export default SafeSheet;

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.4)",
	},

	sheet: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		backgroundColor: "#fff",
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 10,
	},

	handle: {
		width: 40,
		height: 5,
		backgroundColor: "#ccc",
		borderRadius: 3,
		alignSelf: "center",
		marginBottom: 10,
	},
});
