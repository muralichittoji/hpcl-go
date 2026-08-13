// Common UI components
import Header from "@/components/Ui/Header";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import ScrollComponent from "@/components/Ui/ScrollComponent";
import UnifiedListMenu from "@/components/Ui/UnifiedListMenu";

// Static home screen data
import wholeData from "../../constants/Pages";
// Theme
import { Colors } from "@/constants/theme";

// Routing
import { router } from "expo-router";

import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Screen width for layout calculations
const { width } = Dimensions.get("window");

/* -------------------------------------------------------------------------- */
/*                                 HomeScreen                                 */
/* -------------------------------------------------------------------------- */
const HomeScreen = () => {
	/* ---------------------------------------------------------------------- */
	/*                         Central navigation handler                     */
	/* ---------------------------------------------------------------------- */
	const onItemPress = (itemName: any) => {
		switch (itemName) {
			// Static shortcut screens
			case "Knowledge\nCenter":
				router.push("/KnowledgeCenter");
				break;

			case "Product\nFinder":
				router.push("/ProductFinder");
				break;

			case "Product\nComparison":
				router.push("/ProductComparison");
				break;

			// Default → dynamic category navigation
			default:
				router.push({
					pathname: "/SubPage",
					params: { item: JSON.stringify(itemName) },
				});
				break;
		}
	};

	// Loading & network state
	const [loading, setLoading] = useState(false);
	const [slowNet, setSlowNet] = useState(false);

	/* ---------------------------------------------------------------------- */
	/*                                  Render                                  */
	/* ---------------------------------------------------------------------- */
	return (
		<SafeAreaView style={styles.container}>
			{/* App header */}
			<Header caption={"Product \nCatalogue"} />

			{/* Global search input */}
			{/* <InputSearch setLoading={setLoading} setSlowNet={setSlowNet} mode="new" /> */}

			{/* Main content */}
			<ScrollComponent>
				{/* Product categories */}
				<View>
					<UnifiedListMenu
						items={wholeData?.homeScreen}
						navigate={onItemPress}
						showIcons
						bottomMinimise={60}
						itemHeight={170}
					/>
				</View>

				{/* Quick help section */}
				{/* <View>
					<Text style={styles.content}>Quick Help</Text>

					<UnifiedListMenu
						items={wholeData?.quickHelp}
						bottomMinimise={0}
						navigate={onItemPress}
						itemHeight={70}
					/>
				</View> */}

				{/* Explore More CTA (kept for future use) */}
				{/*
				<TouchableOpacity onPress={() => navigate("Explore More")}>
					<Text style={styles.exploreBtn}>Explore More {"->"}</Text>
				</TouchableOpacity>
				*/}
			</ScrollComponent>

			{/* Loading overlay */}
			<LoadingOverlay visible={loading} text="Thinking..." />

			{/* Slow internet modal */}
		</SafeAreaView>
	);
};

export default HomeScreen;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	subContainer: {
		justifyContent: "center",
		alignItems: "center",
	},

	// Section heading (Quick Help)
	content: {
		color: Colors.blueDark,
		fontSize: 20,
		fontWeight: "900",
		marginHorizontal: 10,
		marginTop: 20,
	},

	// (Legacy / reusable styles)
	logo: {
		width: 120,
		height: 120,
		margin: 10,
	},

	itemContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 20,
	},

	salesText: {
		textAlign: "center",
		color: "gray",
		fontWeight: "600",
		fontSize: 16,
	},

	item: {
		height: 70,
		width: width / 2.2,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ccc",
		borderRadius: 10,
	},

	text: {
		textAlign: "center",
		fontSize: 15,
		color: "white",
		fontWeight: "600",
	},

	exploreBtn: {
		color: Colors.blueBright,
		textAlign: "center",
		fontSize: 20,
	},
});
