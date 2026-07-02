// Centralized image registry
import { ALL_IMAGES } from "@/hooks/Allimages";

import React, { useEffect } from "react";
import {
	Animated,
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
	scrollY,
}: {
	caption?: string; // Main heading text
	screen?: string; // Screen identifier (eg: "Login")
	subCaption?: string; // Optional subtitle text
	scrollY?: Animated.Value; // Scroll position reference
}) => {
	const [userEmail, setUserEmail] = React.useState<string | null>(null);

	const headerHeight = scrollY
		? scrollY.interpolate({
				inputRange: [0, 150],
				outputRange: [140, 80],
				extrapolate: "clamp",
		  })
		: 140;

	const logoHeight = scrollY
		? scrollY.interpolate({
				inputRange: [0, 150],
				outputRange: [90, 45],
				extrapolate: "clamp",
		  })
		: 90;

	const titleSize = scrollY
		? scrollY.interpolate({
				inputRange: [0, 150],
				outputRange: [30, 20],
				extrapolate: "clamp",
		  })
		: 30;

	const imageWidth = scrollY
		? scrollY.interpolate({
				inputRange: [0, 150],
				outputRange: [90, 50],
				extrapolate: "clamp",
		  })
		: 90;

	/* ---------------------------------------------------------------------- */
	/*              Dynamic container style based on screen type              */
	/* ---------------------------------------------------------------------- */
	const getStyle = (): ViewStyle => ({
		flexDirection: screen ? "column" : "row",
		justifyContent: screen ? "center" : "flex-start",
		alignItems: "center",
		gap: 10,
		paddingHorizontal: 15,
		width: width - 20,
		marginHorizontal: 10,
		marginTop: 10,
	});

	/* ---------------------------------------------------------------------- */
	/*               Render header logo based on screen context               */
	/* ---------------------------------------------------------------------- */
	const getHeader = () => {
		switch (screen) {
			case "Login":
				return (
					<View style={styles.container}>
						<Image
							style={styles.mainLogo}
							source={ALL_IMAGES.MASTER}
							resizeMode="contain"
						/>
					</View>
				);

			default:
				return (
					<Animated.Image
						source={ALL_IMAGES.MASTER_LOGO}
						resizeMode="contain"
						style={{
							width: imageWidth,
							height: logoHeight,
						}}
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
						paddingVertical: 5,
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
			<Animated.View
				style={[
					getStyle(),
					{
						height: headerHeight,
						minHeight: undefined,
						overflow: "hidden",
					},
				]}
			>
				{/* Logo section */}
				{getHeader()}

				{/* Title & subtitle */}
				<View style={{ width: "70%" }}>
					{caption && (
						<Animated.Text
							numberOfLines={2}
							adjustsFontSizeToFit
							minimumFontScale={0.65}
							style={[
								styles.content,
								{
									fontSize: titleSize,
								},
							]}
						>
							{caption}
						</Animated.Text>
					)}

					{subCaption && <Text style={styles.subTitle}>{subCaption}</Text>}
				</View>

				{/* Bottom divider */}
				<View style={styles.divider} />
			</Animated.View>
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
		elevation: 10,
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
