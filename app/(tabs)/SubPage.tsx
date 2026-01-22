import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import UnifiedListMenu from "@/components/Ui/UnifiedListMenu";
import newData from "@/constants/Jsons/newData.json";
import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const SubPage = () => {
	const { title } = useLocalSearchParams<{ title: string }>();

	const findCategory = (list: any[], name: string): any => {
		for (const item of list) {
			if (item.name === name) return item;

			if (Array.isArray(item.data)) {
				const found = findCategory(item.data, name);
				if (found) return found;
			}
		}
		return null;
	};

	const data = findCategory(newData.homeScreen, title)?.data;

	useEffect(() => {
		if (data && data.length === 1) {
			const item = data[0];

			if (Array.isArray(item.data)) {
				router.replace({
					pathname: "/SubPage",
					params: { title: item.name },
				});
			} else {
				router.replace({
					pathname: "/InfoScreen",
					params: { name: item.data },
				});
			}
		}
	}, [data]);

	const navigate = (item: any) => {
		// If item has a direct route
		if (item?.navigation) {
			router.push({ pathname: item.navigation });
			return;
		}

		// If item has nested data
		if (Array.isArray(item?.data)) {
			router.push({
				pathname: "/SubPage",
				params: { title: item.name },
			});
			return;
		}

		// If item is a final product
		if (typeof item?.data === "string") {
			router.push({
				pathname: "/InfoScreen",
				params: { name: item.data },
			});
			return;
		}
		console.warn("Unhandled navigation item:", item);
	};

	// ⛔ Avoid rendering list while redirecting
	if (data && data.length === 1) {
		return null;
	}

	const hasIcons =
		Array.isArray(data) &&
		data.some(
			(item) => item.iconType === "image" || item.iconType === "vector",
		);

	return (
		<View style={styles.container}>
			<Header caption={title} />
			<InputSearch />

			{data.length > 0 ? (
				<UnifiedListMenu
					items={data}
					navigate={navigate}
					itemHeight={170}
					scrollable
					showIcons={hasIcons}
					useItemName={!hasIcons}
					png
				/>
			) : (
				<Text style={styles.emptyText}>
					<MaterialIcons
						name="priority-high"
						size={24}
						color={Colors.orangeDeep}
					/>
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
