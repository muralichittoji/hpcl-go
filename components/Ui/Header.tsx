// Centralized image registry
import { ALL_IMAGES } from "@/hooks/Allimages";

import React, { useEffect } from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native";

// Theme colors
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Colors } from "../../constants/theme";

// Screen width for responsive sizing
const { width } = Dimensions.get("window");

/* -------------------------------------------------------------------------- */
/*                                   Header                                   */
/* -------------------------------------------------------------------------- */
const Header = ({
	caption,
	screen,
	subCaption,
}: {
	caption?: string; // Main heading text
	screen?: string; // Screen identifier (eg: "Login")
	subCaption?: string; // Optional subtitle text
}) => {
	const [userEmail, setUserEmail] = React.useState<string | null>(null);
	/* ---------------------------------------------------------------------- */
	/*              Dynamic container style based on screen type              *
	/* ---------------------------------------------------------------------- */
	const getStyle = (): ViewStyle => ({
		// Taller header for Login screen
		minHeight: screen === "Login" ? 180 : 120,

		// Percentage height allows responsiveness
		height: "15%",

		display: "flex",

		// Login screen stacks vertically, others are horizontal
		flexDirection: screen ? "column" : "row",

		justifyContent: screen ? "center" : "flex-start",
		alignItems: "center",

		gap: 5,
		padding: 10,

		// Full-width card-style header
		width: width - 20,
		margin: 10,
	});

	/* ---------------------------------------------------------------------- */
	/*               Render header logo based on screen context               */
	/* ---------------------------------------------------------------------- */
	const getHeader = () => {
		switch (screen) {
			case "Login":
				// Large centered logo for login screen
				return (
					<View style={styles.container}>
						<Image
							style={styles.mainLogo}
							source={ALL_IMAGES.MASTER}
							resizeMode="contain"
						/>

						{/* 
							Optional multilingual / branding text 
							(commented for now but kept for future use)
						*/}
					</View>
				);

			default:
				// Compact logo for internal screens
				return (
					<Image
						style={{ width: "25%", height: 150 }}
						source={ALL_IMAGES.MASTER_LOGO}
						resizeMode="contain"
					/>
				);
		}
	};

	const handleLogout = () => {
		AsyncStorage.removeItem("user_details")
			.then(() => {
				setUserEmail(null);
				router.replace("/loginScreen");
			})
			.catch((e) => {
				console.log("Error clearing user email from AsyncStorage:", e);
			});
	};

	useEffect(() => {
		// Log the current screen for debugging
		console.log("Header rendered for screen:", screen);
		AsyncStorage.getItem("user_details")
			.then((userDetails: any) => {
				const parsedDetails = JSON.parse(userDetails);
				setUserEmail(parsedDetails.email);
				console.log("Logged in user email:", parsedDetails.email);
			})
			.catch((e) => {
				console.log("Error fetching user email from AsyncStorage:", e);
			});
	}, [screen]);

	/* ---------------------------------------------------------------------- */
	/*                                  Render                                */
	/* ---------------------------------------------------------------------- */
	return (
		<View style={{ flexDirection: "column" }}>
			{screen !== "Login" && (
				<View
					style={{
						justifyContent: "space-between",
						flexDirection: "row",
						paddingHorizontal: 10,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							textAlign: "center",
							color: "#000",
							fontSize: 16,
							fontWeight: "600",
						}}
					>
						{userEmail ? userEmail : null}
					</Text>
					{userEmail && userEmail !== "guest" ? (
						<TouchableOpacity
							onPress={handleLogout}
							style={{
								backgroundColor: Colors.blueDeep,
								padding: 5,
								borderRadius: 10,
							}}
						>
							<Text
								style={{
									textAlign: "center",
									color: "#fff",
									fontWeight: "600",
									fontSize: 16,
								}}
							>
								Logout
							</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={{
								backgroundColor: Colors.blueDeep,
								padding: 5,
								borderRadius: 10,
							}}
							onPress={handleLogout}
						>
							<Text
								style={{
									textAlign: "center",
									color: "#fff",
									fontWeight: "600",
									fontSize: 16,
								}}
							>
								Login
							</Text>
						</TouchableOpacity>
					)}
					{/* Show login button if no user is logged in */}
				</View>
			)}
			<View style={getStyle()}>
				{/* Logo section */}
				{getHeader()}

				{/* Title & subtitle */}
				<View style={{ width: "70%" }}>
					{caption && (
						<Text
							numberOfLines={2}
							adjustsFontSizeToFit
							minimumFontScale={0.65}
							style={styles.content}
						>
							{caption}
						</Text>
					)}

					{subCaption && <Text style={styles.subTitle}>{subCaption}</Text>}
				</View>

				{/* Bottom divider */}
				<View style={styles.divider} />
			</View>
			<View>
				{caption && caption !== "Product \nCatalogue" && (
					<View
						style={{
							flexDirection: "row",
							paddingHorizontal: 10,
							justifyContent: "space-between",
						}}
					>
						<TouchableOpacity
							onPress={() => router.back()}
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 3,
								backgroundColor: Colors.grayDeep,
								padding: 5,
								borderRadius: 20,
							}}
						>
							<MaterialIcons name="arrow-back" size={30} color={Colors.white} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => router.replace("/homeScreen")}
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 3,
								backgroundColor: Colors.grayDeep,
								padding: 5,
								borderRadius: 20,
							}}
						>
							<MaterialIcons name="home" size={30} color={Colors.white} />
						</TouchableOpacity>
					</View>
				)}
			</View>
		</View>
	);
};

export default Header;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
	// Login header container
	container: {
		flexDirection: "row",
		alignItems: "center",
		padding: 5,
		marginTop: 30,
	},

	// Large logo for login screen
	mainLogo: {
		width: "100%",
		height: 210,
		marginRight: 5,
	},

	// (Unused currently) Smaller logo style
	headImage: {
		width: "25%",
		height: 200,
		marginRight: 5,
	},

	// Main title text
	content: {
		color: Colors.blueDark,
		fontSize: 30,
		fontWeight: "700",
	},

	// Subtitle text
	subTitle: {
		fontSize: 14,
		color: Colors.grayDeep,
	},

	// Optional header branding text
	headText: {
		color: Colors.blueDeep,
		fontSize: 15,
		fontWeight: "700",
	},

	// Bottom divider line
	divider: {
		height: 1,
		backgroundColor: "#000",
	},
});
