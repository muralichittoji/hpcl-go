import Header from "@/components/Ui/Header";
import { Colors } from "@/constants/theme";
import React from "react";
import {
	Dimensions,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
	return (
		<View style={styles.container}>
			<Header caption="Welcome to Login" screen="Login" />
			<View style={styles.subContainer}>
				<View style={{ width: width }}>
					<TextInput placeholder="Username/email" style={styles.input} />
					<TextInput placeholder="Password" style={styles.input} />
					<TouchableOpacity style={styles.logBtn}>
						<Text style={styles.logText}>Login</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={styles.forgBtn}>
					<Text style={styles.forgText}>Forgot Password ?</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	subContainer: {
		width: width,
		height: "65%",
		display: "flex",
		justifyContent: "space-around",
		alignItems: "center",
	},
	input: {
		width: "90%",
		height: 40,
		borderWidth: 1,
		borderRadius: 10,
		margin: "5%",
		padding: 10,
		fontSize: 20,
	},
	logBtn: {
		width: "90%",
		margin: "5%",
		height: 40,
		backgroundColor: Colors.blueDark,
		padding: 5,
		borderRadius: 10,
	},
	logText: {
		fontSize: 20,
		padding: 5,
		textAlign: "center",
		color: Colors.white,
		fontWeight: "600",
	},
	forgBtn: {
		width: "90%",
		margin: "5%",
		height: 40,
		padding: 5,
	},
	forgText: {
		fontSize: 20,
		textAlign: "center",
		color: Colors.blueDark,
		fontWeight: "600",
	},
});
