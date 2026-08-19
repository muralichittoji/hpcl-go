import Header from "@/components/Ui/Header";
import { Colors } from "@/constants/theme";
import { rf } from "@/utils/responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
	const handleNavigation = () => {
		AsyncStorage.setItem(
			"user_details",
			JSON.stringify({ email: "guest" }),
		).then(() => {
			router.push("/homeScreen");
		});
	};
	return (
		<SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
			<Header caption="" screen="Login" />

			<View style={styles.subContainer}>
				<View style={styles.copyBlock}>
					<Text style={styles.content}>Your Product Catalogue</Text>

					<Text style={styles.description}>
						Explore Motor Fuels, LPG, Lubricants, Industrial Fuels and more
					</Text>
				</View>

				<TouchableOpacity
					style={styles.enterBtn}
					onPress={() => handleNavigation()}
				>
					<Text style={styles.enterText}>ENTER</Text>
				</TouchableOpacity>
			</View>

			{/* <Footer screen="welcome" /> */}
		</SafeAreaView>
	);
};

export default WelcomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
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
		alignSelf: "center",
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
	subContainer: {
		flex: 1,
		width: "100%",
		justifyContent: "space-evenly",
		alignItems: "center",
		paddingHorizontal: 16,
	},
	copyBlock: {
		width: "100%",
		alignItems: "center",
	},
});
