// Common UI components
import CommonModal from "@/components/Ui/CommonModal";
import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import UnifiedListMenu from "@/components/Ui/UnifiedListMenu";

// Static home screen data
import wholeData from "@/constants/Jsons/newData.json";

// Theme
import { Colors } from "@/constants/theme";

// Routing
import { router } from "expo-router";

import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

// Screen width for layout calculations
const { width } = Dimensions.get("window");

/* -------------------------------------------------------------------------- */
/*                                 HomeScreen                                 */
/* -------------------------------------------------------------------------- */
const HomeScreen = () => {
	/* ---------------------------------------------------------------------- */
	/*                         Central navigation handler                       */
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

			case "Explore More":
				router.push("/ExploreMore");
				break;

			// Default → dynamic category navigation
			default:
				router.push({
					pathname: "/SubPage",
					params: { title: itemName.name },
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
		<View style={styles.container}>
			{/* App header */}
			<Header caption={"Product \nCatalogue"} />

			{/* Global search input */}
			<InputSearch setLoading={setLoading} setSlowNet={setSlowNet} />

			{/* Main content */}
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 30 }}
			>
				{/* Product categories */}
				<View>
					<UnifiedListMenu
						items={wholeData?.homeScreen}
						navigate={onItemPress}
						showIcons
						itemHeight={170}
					/>
				</View>

				{/* Quick help section */}
				<View>
					<Text style={styles.content}>Quick Help</Text>

					<UnifiedListMenu
						items={wholeData.quickHelp}
						navigate={onItemPress}
						itemHeight={70}
					/>
				</View>

				{/* Explore More CTA (kept for future use) */}
				{/*
				<TouchableOpacity onPress={() => navigate("Explore More")}>
					<Text style={styles.exploreBtn}>Explore More {"->"}</Text>
				</TouchableOpacity>
				*/}
			</ScrollView>

			{/* Loading overlay */}
			<LoadingOverlay visible={loading} text="Thinking..." />

			{/* Slow internet modal */}
			<CommonModal
				visible={slowNet}
				title="Slow Internet"
				message="Backend Servers are at full swing. Please try again."
				icon="speedometer-outline"
				buttonText="Retry"
				onPress={() => setSlowNet(false)}
			/>
		</View>
	);
};

export default HomeScreen;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
	container: {
		height: "100%",
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
