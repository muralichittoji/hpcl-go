import CommonModal from "@/components/Ui/CommonModal";
import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import UnifiedListMenu from "@/components/Ui/UnifiedListMenu";

import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";

const SubPage = () => {
	const { item } = useLocalSearchParams<{ item: string }>();

	const parsedItem = item ? JSON.parse(item) : null;

	const rawData = parsedItem?.value;
	const title = parsedItem?.label;

	// ✅ IMPORTANT FIX
	const data = Array.isArray(rawData) ? rawData : null;

	const [slowNet, setSlowNet] = useState(false);
	const [loading, setLoading] = useState(false);

	/* ---------------- AUTO REDIRECT ---------------- */
	useEffect(() => {
		if (!rawData) return;

		// ✅ If it's a FINAL PRODUCT → go to InfoScreen
		if (typeof rawData === "string") {
			router.replace({
				pathname: "/InfoScreen",
				params: { name: rawData },
			});
			return;
		}

		// ✅ If it's a LIST with single item
		if (Array.isArray(rawData) && rawData.length === 1) {
			const item = rawData[0];

			if (Array.isArray(item.value)) {
				router.replace({
					pathname: "/SubPage",
					params: { item: JSON.stringify(item) },
				});
			} else {
				router.replace({
					pathname: "/InfoScreen",
					params: { name: item.value },
				});
			}
		}
	}, [rawData]);

	/* ---------------- NAVIGATION ---------------- */
	const onItemPress = (item: any) => {
		if (item?.type === "link") {
			const url = item.value ?? item.value;
			if (typeof url === "string") {
				Linking.openURL(url).catch(() => {
					console.warn("Failed to open link:", url);
				});
			}
			return;
		}

		if (typeof item === "string") {
			router.push({
				pathname: "/InfoScreen",
				params: { name: item },
			});
			return;
		}

		if (item?.navigation) {
			router.push({ pathname: item.navigation });
			return;
		}

		if (!item?.value) return;

		if (Array.isArray(item.value)) {
			router.push({
				pathname: "/SubPage",
				params: { item: JSON.stringify(item) },
			});
			return;
		}

		if (typeof item.value === "string") {
			router.push({
				pathname: "/InfoScreen",
				params: { name: item.value },
			});
		}
	};

	/* ---------------- PREVENT FLASH ---------------- */
	if (
		typeof rawData === "string" ||
		(Array.isArray(rawData) && rawData.length === 1)
	) {
		return null;
	}

	const hasIcons =
		Array.isArray(data) &&
		data.some(
			(item) => item.iconType === "image" || item.iconType === "vector",
		);

	/* ---------------- UI ---------------- */
	return (
		<View style={styles.container}>
			<Header caption={title} />

			<InputSearch setLoading={setLoading} setSlowNet={setSlowNet} />

			<LoadingOverlay visible={loading} text="Analyzing..." />

			<CommonModal
				visible={slowNet}
				title="Slow Internet"
				message="Backend Servers are at full swing. Please try again."
				icon="speedometer-outline"
				buttonText="Retry"
				onPress={() => setSlowNet(false)}
			/>

			{data && data.length > 0 ? (
				<UnifiedListMenu
					items={data}
					navigate={onItemPress}
					itemHeight={170}
					scrollable
					bottomMinimise={60}
					showIcons={hasIcons}
					useItemName={!hasIcons}
				/>
			) : (
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
