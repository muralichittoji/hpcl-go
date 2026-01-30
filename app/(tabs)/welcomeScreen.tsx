import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import Header from "@/components/Ui/Header";
import { Colors } from "@/constants/theme";
import { rf } from "@/utils/responsive";
import { router } from "expo-router";
import React from "react";

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
	return (
		<View style={styles.container}>
			<Header caption="" screen="Login" />

			<View style={styles.subContainer}>
				<View>
					<Text style={styles.content}>Your Product Catalogue</Text>

					<Text style={styles.description}>
						Explore Motor Fuels, LPG, Lubricants, Industrial Fuels and more
					</Text>

					<TouchableOpacity
						style={styles.enterBtn}
						onPress={() => router.push("/homeScreen")}
					>
						<Text style={styles.enterText}>ENTER</Text>
					</TouchableOpacity>
				</View>

				{/* LOGIN BUTTON */}
				<TouchableOpacity onPress={() => router.push("/loginScreen")}>
					<Text style={styles.loginText}>FOR SALES OFFICERS {"->"} LOGIN</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default WelcomeScreen;

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	content: {
		textAlign: "center",
		color: Colors.blueDark,
		fontSize: 35,
		fontWeight: "700",
		margin: 10,
	},
	description: {
		textAlign: "center",
		color: "#555",
		fontSize: 25,
		fontWeight: "500",
		margin: 20,
	},
	enterBtn: {
		width: width - 40,
		marginVertical: 60,
		marginHorizontal: "5%",
		height: 70,
		backgroundColor: Colors.blueDeep,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	enterText: {
		color: "white",
		fontSize: rf(25),
		fontWeight: "600",
	},
	loginText: {
		textAlign: "center",
		color: Colors.blueDark,
		fontSize: 20,
		fontWeight: "400",
	},
	changeLangText: {
		marginTop: 10,
		fontSize: 16,
		color: Colors.blueDeep,
		textDecorationLine: "underline",
	},
	subContainer: {
		width: width,
		height: "70%",
		justifyContent: "space-around",
		alignItems: "center",
	},

	/* ===== MODAL STYLES ===== */
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalBox: {
		width: 260,
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 15,
		color: Colors.blueDark,
	},
	langOption: {
		width: "100%",
		paddingVertical: 12,
		alignItems: "center",
		borderRadius: 8,
		marginVertical: 6,
		borderWidth: 1,
		borderColor: "#ccc",
	},
	activeLang: {
		backgroundColor: Colors.blueLight,
		borderColor: Colors.blueDeep,
	},
	langText: {
		fontSize: 16,
		color: Colors.black,
	},
	closeBtn: {
		marginTop: 10,
	},
	closeText: {
		color: "#888",
		fontSize: 14,
	},
});
