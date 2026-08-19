import CommonModal from "@/components/Ui/CommonModal";
import SubPageListView from "@/components/Ui/SubPageListView";
import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Linking, StyleSheet, Text } from "react-native";

const hasItemValue = (value: any) => {
	if (value == null) return false;
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	return true;
};

const SubPage = () => {
	const { item } = useLocalSearchParams<{ item: string }>();

	const parsedItem = item ? JSON.parse(item) : null;

	const rawData = parsedItem?.value;
	const title = parsedItem?.label;
	const useWideBanner = [
		"FUEL_ICON",
		"INDUSTRIAL_ICON",
		"PETCHEM_ICON",
	].includes(parsedItem?.icon);
	const bannerIcon = useWideBanner
		? parsedItem?.icon_back || parsedItem?.icon
		: parsedItem?.icon;

	// ✅ IMPORTANT FIX
	const data = Array.isArray(rawData) ? rawData : null;

	const [slowNet, setSlowNet] = useState(false);

	/* ---------------- NAVIGATION HANDLER (memoized to avoid dependency issues) ---------------- */
	const onItemPress = useCallback(
		(item: any) => {
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
					params: {
						name: item,
						pageId: parsedItem?.id,
						pageLabel: parsedItem?.label,
					},
				});
				return;
			}

			if (item?.navigation) {
				router.push({ pathname: item.navigation });
				return;
			}

			if (!item?.value) return;

			if (Array.isArray(item.value)) {
				const navigationItem = {
					...item,
					icon: item.icon || parsedItem?.icon,
					icon_back: item.icon_back || parsedItem?.icon_back,
					iconType: item.iconType || parsedItem?.iconType,
					categoryIndex: item.categoryIndex ?? parsedItem?.categoryIndex,
				};
				router.push({
					pathname: "/SubPage",
					params: { item: JSON.stringify(navigationItem) },
				});
				return;
			}

			if (typeof item.value === "string") {
				router.push({
					pathname: "/InfoScreen",
					params: {
						name: item.value,
						pageId: parsedItem?.id,
						pageLabel: parsedItem?.label,
					},
				});
			}
		},
		[parsedItem?.id, parsedItem?.label, parsedItem?.icon, parsedItem?.icon_back, parsedItem?.iconType, parsedItem?.categoryIndex],
	);

	const listItems = useMemo(() => {
		if (!data || !Array.isArray(data)) return [];

		return data.map((item: any) => ({
			label: item.label || "Untitled",
			onPress: () => onItemPress(item),
			hasValue: hasItemValue(item.value),
		}));
	}, [data, onItemPress]);

	/* ---------------- AUTO REDIRECT ---------------- */
	useEffect(() => {
		if (!rawData) return;

		if (typeof rawData === "string") {
			router.replace({
				pathname: "/InfoScreen",
				params: {
					name: rawData,
					pageId: parsedItem?.id,
					pageLabel: parsedItem?.label,
				},
			});
			return;
		}

		// ✅ If it's a LIST with single item
		if (Array.isArray(rawData) && rawData.length === 1) {
			const item = rawData[0];

			if (Array.isArray(item.value)) {
				const navigationItem = {
					...item,
					icon: item.icon || parsedItem?.icon,
					icon_back: item.icon_back || parsedItem?.icon_back,
					iconType: item.iconType || parsedItem?.iconType,
					categoryIndex: item.categoryIndex ?? parsedItem?.categoryIndex,
				};
				router.replace({
					pathname: "/SubPage",
					params: { item: JSON.stringify(navigationItem) },
				});
			} else {
				router.replace({
					pathname: "/InfoScreen",
					params: {
						name: item.value,
						pageId: parsedItem?.id,
						pageLabel: parsedItem?.label,
					},
				});
			}
		}
	}, [
		rawData,
		parsedItem?.id,
		parsedItem?.label,
		parsedItem?.icon,
		parsedItem?.icon_back,
		parsedItem?.iconType,
		parsedItem?.categoryIndex,
	]);

	/* ---------------- PREVENT FLASH & EARLY RETURNS ---------------- */
	// Must be after all hooks
	if (
		typeof rawData === "string" ||
		(Array.isArray(rawData) && rawData.length === 1)
	) {
		return null;
	}

	if (!title) {
		return (
			<Text style={styles.emptyText}>
				<MaterialIcons
					name="priority-high"
					size={24}
					color={Colors.orangeDeep}
				/>{" "}
				Coming Soon
			</Text>
		);
	}

	/* ---------------- UI ---------------- */
	return (
		<>
			<CommonModal
				visible={slowNet}
				title="Slow Internet"
				message="Backend Servers are at full swing. Please try again."
				icon="speedometer-outline"
				buttonText="Retry"
				onPress={() => setSlowNet(false)}
			/>

			{data && data.length > 0 ? (
				<SubPageListView
					title={title}
					bannerIcon={bannerIcon}
					centerBanner={!useWideBanner}
					items={listItems}
					scrollable={true}
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
		</>
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
