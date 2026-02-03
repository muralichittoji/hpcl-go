// Centralized image registry
import { ALL_IMAGES } from "@/hooks/Allimages";

import React from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from "react-native";

// Theme colors
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
	/* ---------------------------------------------------------------------- */
	/*              Dynamic container style based on screen type              */
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
	/*               Render header logo based on screen context                */
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

	/* ---------------------------------------------------------------------- */
	/*                                  Render                                  */
	/* ---------------------------------------------------------------------- */
	return (
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
