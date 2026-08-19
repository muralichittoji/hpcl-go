// Common UI components
import Footer from "@/components/Ui/Footer";
import HomeHeader from "@/components/Ui/HomeHeader";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import UnifiedListMenu from "@/components/Ui/UnifiedListMenu";

// Static home screen data
import wholeData from "../../constants/Pages";
// Theme
import { Colors } from "@/constants/theme";

// Routing
import { router } from "expo-router";

import { countCatalogueItems } from "@/utils/catalogueItems";
import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

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

	const homeItems = useMemo(() => {
		const categories = (wholeData?.homeScreen ?? []).map((category, index) => ({
			...category,
			itemCount: countCatalogueItems(category),
			categoryIndex: index,
		}));

		return [...categories];
	}, []);

	const columns = 2;
	const [listHeight, setListHeight] = useState(0);
	const rows = Math.ceil(homeItems.length / columns);
	const itemGap = 12;
	const itemHeight =
		listHeight > 0 && rows > 0
			? Math.max(72, (listHeight - itemGap * (rows - 1) - 10) / rows)
			: 90;

	/* ---------------------------------------------------------------------- */
	/*                                  Render                                  */
	/* ---------------------------------------------------------------------- */
	return (
		<View style={styles.container}>
			<HomeHeader />

			<View
				style={styles.body}
				onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
			>
				<UnifiedListMenu
					items={homeItems}
					navigate={onItemPress}
					showIcons
					bottomMinimise={0}
					itemHeight={itemHeight}
					columns={columns}
				/>
			</View>

			<Footer screen="welcome" height={148} />

			<LoadingOverlay visible={loading} text="Thinking..." />
		</View>
	);
};

export default HomeScreen;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	body: {
		flex: 1,
		justifyContent: "flex-start",
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
