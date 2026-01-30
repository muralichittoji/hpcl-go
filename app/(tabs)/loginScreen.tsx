import Header from "@/components/Ui/Header";
import { Colors } from "@/constants/theme";
import { rf } from "@/utils/responsive";
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
			<Header caption="" screen="Login" />
			<Text style={styles.content}>Welcome to Login</Text>
			<View style={styles.subContainer}>
				<View style={{ width: width }}>
					<TextInput
						placeholder="Username/email"
						placeholderTextColor={Colors.grayDeep}
						style={styles.input}
					/>
					<TextInput
						placeholder="Password"
						placeholderTextColor={Colors.grayDeep}
						style={styles.input}
					/>
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
		width: width,
	},
	content: {
		color: Colors.blueDark,
		fontSize: 35,
		fontWeight: "500",
		textAlign: "center",
		margin: 5,
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
		height: 50,
		borderWidth: 1,
		borderRadius: 10,
		margin: "5%",
		padding: 10,
		fontSize: rf(20),
	},
	logBtn: {
		width: "90%",
		margin: "5%",
		height: 60,
		backgroundColor: Colors.blueDark,
		padding: 5,
		borderRadius: 10,
	},
	logText: {
		fontSize: rf(25),
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
		fontSize: rf(20),
		textAlign: "center",
		color: Colors.blueDark,
		fontWeight: "600",
	},
});
