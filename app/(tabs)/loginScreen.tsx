import Header from "@/components/Ui/Header";
import { Colors } from "@/constants/theme";
import { rf } from "@/utils/responsive";
import React from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
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

	return (
		// KeyboardAvoidingView shifts UI when keyboard opens
		<KeyboardAvoidingView
			style={{ flex: 1 }} // Must be flex:1, height breaks keyboard behavior
			behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS uses padding, Android uses height
			keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // Offset for Header height (important!)
		>
			{/* ScrollView allows content to move when keyboard opens */}
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }} // Allows full height + scrolling
				keyboardShouldPersistTaps="handled" // Keeps keyboard open while tapping inputs/buttons
			>
				<View style={[styles.container, { width }]}>
					{/* App header */}
					<Header caption="" screen="Login" />

					{/* Screen title */}
					<Text style={styles.content}>Welcome to Login</Text>

					{/* Main form container */}
					<View style={styles.subContainer}>
						<View style={{ width }}>
							{/* Username / Email input */}
							<TextInput
								placeholder="Username/email"
								placeholderTextColor={Colors.grayDeep}
								style={styles.input}
							/>

							{/* Password input */}
							<TextInput
								placeholder="Password"
								placeholderTextColor={Colors.grayDeep}
								style={styles.input}
								secureTextEntry // Hides password text
							/>

							{/* Login button */}
							<TouchableOpacity style={styles.logBtn}>
								<Text style={styles.logText}>Login</Text>
							</TouchableOpacity>
						</View>

						{/* Forgot password action */}
						<TouchableOpacity style={styles.forgBtn}>
							<Text style={styles.forgText}>Forgot Password ?</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	// Page title
	content: {
		color: Colors.blueDark,
		fontSize: 35,
		fontWeight: "500",
		textAlign: "center",
		margin: 5,
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
});
