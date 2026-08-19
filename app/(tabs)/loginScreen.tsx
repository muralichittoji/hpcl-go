import Footer from "@/components/Ui/Footer";
import HomeHeader from "@/components/Ui/HomeHeader";
import ScrollComponent from "@/components/Ui/ScrollComponent";
import { Colors } from "@/constants/theme";
import { AdloginUser } from "@/utils/authService";
import { rf } from "@/utils/responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";

const LoginScreen = () => {
	// Get current screen width (updates on orientation change / font scaling)
	const { width } = useWindowDimensions();
	const [email, setEmail] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");

	const handleLogin = () => {
		console.log("Attempting login with:", { email, password });
		AdloginUser({ email, password })
			.then((response) => {
				AsyncStorage.setItem("user_details", JSON.stringify(response.result)); // Store user details for later use
				console.log("Login response:", response);
				if (response.result !== null && response.result !== undefined) {
					router.push("/homeScreen");
				} else {
					alert("Login failed: " + response.message);
				}
			})
			.catch((error) => {
				console.error("Login error:", error);
				alert("An error occurred during login. Please try again.");
			});
	};

	const handleGuestLogin = () => {
		console.log("Continuing as guest");
		AsyncStorage.setItem("user_details", JSON.stringify({ email: "guest" })); // Store user details for later use
		router.push("/homeScreen");
	};

	return (
		<View style={styles.container}>
			<HomeHeader title="Welcome to Login" />

			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollComponent bg="#fff" bottom={20}>
					<View style={styles.subContainer}>
						<View style={{ width }}>
							<TextInput
								placeholder="Username/email"
								placeholderTextColor={Colors.grayDeep}
								value={email}
								onChangeText={setEmail}
								style={styles.input}
							/>

							<TextInput
								placeholder="Password"
								placeholderTextColor={Colors.grayDeep}
								value={password}
								onChangeText={setPassword}
								style={styles.input}
								secureTextEntry
							/>

							<TouchableOpacity style={styles.logBtn} onPress={handleLogin}>
								<Text style={styles.logText}>Login</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							style={styles.guestBtn}
							onPress={handleGuestLogin}
						>
							<Text style={styles.guestText}>Continue as guest</Text>
						</TouchableOpacity>
					</View>
				</ScrollComponent>
			</KeyboardAvoidingView>

			<Footer screen="welcome" />
		</View>
	);
};

export default LoginScreen;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},

	// Page title
	content: {
		color: Colors.blueDark,
		fontSize: 35,
		fontWeight: "500",
		textAlign: "center",
		margin: 25,
	},

	// Form wrapper
	subContainer: {
		flex: 1,
		justifyContent: "space-around",
		alignItems: "center",
	},

	// Text inputs
	input: {
		width: "90%",
		height: 50,
		borderWidth: 1,
		borderRadius: 10,
		margin: "5%",
		padding: 10,
		fontSize: rf(20),
	},

	// Login button
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

	// Forgot password button
	forgBtn: {
		width: "90%",
		margin: "5%",
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},

	forgText: {
		fontSize: rf(20),
		textAlign: "center",
		color: Colors.blueDark,
		fontWeight: "600",
	},

	guestBtn: {
		width: "90%",
		margin: "5%",
		height: 50,
		backgroundColor: Colors.grayDeep,
		padding: 5,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},

	guestText: {
		fontSize: rf(20),
		padding: 5,
		textAlign: "center",
		color: Colors.black,
		fontWeight: "600",
	},
});
