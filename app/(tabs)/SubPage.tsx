// Common reusable UI components
import CommonModal from "@/components/Ui/CommonModal";
import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import UnifiedListMenu from "@/components/Ui/UnifiedListMenu";

// Static navigation data
import newData from "@/constants/Jsons/newData.json";

// Theme & icons
import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

// Expo Router utilities
import { router, useLocalSearchParams } from "expo-router";

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

/* -------------------------------------------------------------------------- */
/*                                  SubPage                                   */
/* -------------------------------------------------------------------------- */
const SubPage = () => {
	// Read title param from route (/SubPage?title=...)
	const { title } = useLocalSearchParams<{ title: string }>();

	// Network & loading states
	const [slowNet, setSlowNet] = useState(false);
	const [loading, setLoading] = useState(false);

	/* ---------------------------------------------------------------------- */
	/*                Recursively find category by name                        */
	/* ---------------------------------------------------------------------- */
	const findCategory = (list: any[], name: string): any => {
		for (const item of list) {
			// Match found at current level
			if (item.name === name) return item;

			// Dive into nested children
			if (Array.isArray(item.data)) {
				const found = findCategory(item.data, name);
				if (found) return found;
			}
		}
		return null;
	};

	// Extract data for current category
	const data = findCategory(newData.homeScreen, title)?.data;
	// const titleName = findCategory(newData.homeScreen, title)?.title;

	/* ---------------------------------------------------------------------- */
	/*     Auto-redirect when only one item exists in the category             */
	/* ---------------------------------------------------------------------- */
	useEffect(() => {
		if (data && data.length === 1) {
			const item = data[0];

			// Single nested category → drill down automatically
			if (Array.isArray(item.data)) {
				router.replace({
					pathname: "/SubPage",
					params: { title: item.name },
				});
			}
			// Single final product → go straight to info screen
			else {
				router.replace({
					pathname: "/InfoScreen",
					params: { name: item.data },
				});
			}
		}
	}, [data]);

	/* ---------------------------------------------------------------------- */
	/*                         Central navigation logic                         */
	/* ---------------------------------------------------------------------- */
	const onItemPress = (item: any) => {
		// Direct route navigation (explicit screen)
		if (item?.navigation) {
			router.push({ pathname: item.navigation });
			return;
		}

		// Ignore empty data nodes
		if (
			item?.data == null ||
			(typeof item.data === "string" && item.data.trim() === "")
		) {
			return;
		}

		// Nested category → navigate deeper
		if (Array.isArray(item?.data)) {
			router.push({
				pathname: "/SubPage",
				params: { title: item.name },
			});
			return;
		}

		// Final leaf node → product info page
		if (typeof item?.data === "string") {
			router.push({
				pathname: "/InfoScreen",
				params: { name: item.data },
			});
			return;
		}

		// Safety fallback
		console.warn("Unhandled navigation item:", item);
	};

	/* ---------------------------------------------------------------------- */
	/*     Prevent rendering UI while auto-redirect is in progress              */
	/* ---------------------------------------------------------------------- */
	if (data && data.length === 1) {
		return null;
	}

	/* ---------------------------------------------------------------------- */
	/*                       Detect if icons are present                        */
	/* ---------------------------------------------------------------------- */
	const hasIcons =
		Array.isArray(data) &&
		data.some(
			(item) => item.iconType === "image" || item.iconType === "vector",
		);

	/* ---------------------------------------------------------------------- */
	/*                                  Render                                  */
	/* ---------------------------------------------------------------------- */
	return (
		<View style={styles.container}>
			{/* Page Header */}
			<Header caption={title} />

			{/* Search input with loading & slow-network callbacks */}
			<InputSearch setLoading={setLoading} setSlowNet={setSlowNet} />

			{/* Global loading overlay */}
			<LoadingOverlay visible={loading} text="Analyzing..." />

			{/* Slow internet warning modal */}
			<CommonModal
				visible={slowNet}
				title="Slow Internet"
				message="Backend Servers are at full swing. Please try again."
				icon="speedometer-outline"
				buttonText="Retry"
				onPress={() => setSlowNet(false)}
			/>

			{/* Main content */}
			{data?.length > 0 ? (
				<UnifiedListMenu
					items={data}
					navigate={onItemPress}
					itemHeight={170}
					scrollable
					showIcons={hasIcons}
					useItemName={!hasIcons}
				/>
			) : (
				// Empty state
				<Text style={styles.emptyText}>
					<MaterialIcons
						name="priority-high"
						size={24}
						color={Colors.orangeDeep}
					/>{" "}
					Coming Soon
				</Text>
			)}
		</View>
	);
};

export default SubPage;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	emptyText: {
		fontSize: 35,
		fontWeight: "400",
		textAlign: "center",
		color: Colors.orangeDeep,
		marginVertical: 140,
	},
});
