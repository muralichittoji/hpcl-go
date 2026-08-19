import { Colors } from "@/constants/theme";
import { searchProducts, type ProductSummary } from "@/lib/products";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedQuery(query.trim()), 200);
		return () => clearTimeout(timer);
	}, [query]);

	const suggestions = useMemo(() => {
		if (!debouncedQuery) return [];
		return searchProducts(debouncedQuery, 0, 40).items;
	}, [debouncedQuery]);

	const openProduct = (item: ProductSummary) => {
		router.push({
			pathname: "/InfoScreen",
			params: { name: item.code },
		});
	};

	const emptyMessage = debouncedQuery
		? "No matching products"
		: "No recent searches";

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<View style={styles.searchBar}>
					<TouchableOpacity
						onPress={() => router.back()}
						hitSlop={8}
						accessibilityRole="button"
						accessibilityLabel="Go back"
					>
						<Ionicons name="arrow-back" size={22} color="#555" />
					</TouchableOpacity>
					<TextInput
						style={styles.input}
						value={query}
						onChangeText={setQuery}
						placeholder="Search products"
						placeholderTextColor="#9A9A9A"
						autoFocus
						returnKeyType="search"
						autoCorrect={false}
						autoCapitalize="none"
					/>
				</View>

				<FlatList
					data={suggestions}
					keyExtractor={(item) => item.code}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={
						suggestions.length === 0 ? styles.emptyList : styles.list
					}
					ListEmptyComponent={
						<Text style={styles.emptyText}>{emptyMessage}</Text>
					}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.suggestion}
							onPress={() => openProduct(item)}
						>
							<Ionicons name="search-outline" size={18} color="#777" />
							<View style={styles.suggestionText}>
								<Text style={styles.suggestionTitle} numberOfLines={1}>
									{item.title || item.code}
								</Text>
								{item.subTitle ? (
									<Text style={styles.suggestionSub} numberOfLines={1}>
										{item.subTitle}
									</Text>
								) : null}
							</View>
						</TouchableOpacity>
					)}
				/>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default SearchScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	flex: {
		flex: 1,
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 16,
		marginTop: 8,
		marginBottom: 8,
		paddingHorizontal: 12,
		height: 46,
		borderRadius: 12,
		backgroundColor: "#F2F2F4",
		gap: 8,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: "#222",
		paddingVertical: 0,
	},
	list: {
		paddingHorizontal: 8,
		paddingBottom: 24,
	},
	emptyList: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		color: "#B0B0B0",
		fontSize: 16,
	},
	suggestion: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
		gap: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#EDEDED",
	},
	suggestionText: {
		flex: 1,
	},
	suggestionTitle: {
		fontSize: 16,
		color: Colors.blueDark,
		fontWeight: "600",
	},
	suggestionSub: {
		marginTop: 2,
		fontSize: 13,
		color: "#777",
	},
});
