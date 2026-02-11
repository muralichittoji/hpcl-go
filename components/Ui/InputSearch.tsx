import { Colors } from "@/constants/theme";
import { getAnswer } from "@/utils/authService";
import { useNetwork } from "@/utils/NetworkProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import CameraScreen from "./Camera";

const { width } = Dimensions.get("window");

type SearchProps = {
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setSlowNet: React.Dispatch<React.SetStateAction<boolean>>;
	placeHolder?: string;
};

const InputSearch = ({
	setLoading,
	setSlowNet,
	placeHolder = "Search Products",
}: SearchProps) => {
	const [search, setSearch] = useState("");
	const { isOnline } = useNetwork();

	const findScreen = () => {
		if (!search?.trim()) return;
		getSearch(search.trim());
	};

	const getSearch = async (question: string) => {
		let timeoutId: any;

		try {
			setLoading(true);

			// if (!isOnline) {
			// 	setSlowNet(true);
			// 	return;
			// }

			// ⭐ manual slow-network guard (10s)
			timeoutId = setTimeout(() => {
				setLoading(false);
				setSlowNet(true);
			}, 10000);

			const res = await getAnswer({ question });
			clearTimeout(timeoutId);

			const rawAnswer = res?.results?.[0]?.answer;

			if (!rawAnswer) {
				setSlowNet(true);
				return;
			}

			if (res) {
				setSlowNet(false);
			}

			const parsed = JSON.parse(rawAnswer);

			router.push({
				pathname: "/(tabs)/result",
				params: {
					response: parsed.response,
					productCode: parsed.app_product_code ?? "na",
					question,
				},
			});
		} catch (e) {
			console.log(e);
			setSlowNet(true);
		} finally {
			setLoading(false);
			clearTimeout(timeoutId);
		}
	};

	return (
		<View style={styles.searchInputContainer}>
			<View style={styles.inputWrapper}>
				<Ionicons name="search" size={22} color="#888" />
				<TextInput
					placeholder={placeHolder}
					placeholderTextColor={Colors.grayDeep}
					style={styles.searchInput}
					value={search}
					onChangeText={setSearch}
					onSubmitEditing={findScreen}
					returnKeyType="search"
				/>
			</View>
			<CameraScreen />
		</View>
	);
};

export default InputSearch;

const styles = StyleSheet.create({
	searchInputContainer: {
		width: "95%",
		maxWidth: "95%",
		height: 50,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#e6e6e6",
		borderRadius: 15,
		marginVertical: 20,
		marginHorizontal: 10,
		paddingHorizontal: 10,
		shadowColor: "#000",
		shadowOpacity: 0.3,
		shadowRadius: 2,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		width: width / 1.27,
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
	},
});
