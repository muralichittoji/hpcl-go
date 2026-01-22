import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Dimensions, StyleSheet, TextInput, View } from "react-native";
import CameraScreen from "./Camera";

const { width } = Dimensions.get("window");

const BITUMEN_GRADES = ["VG-10", "VG-30", "VG-40"];
// const Industrial_Liquids = ['Hexane', 'LDO', 'MV2'];
const FUEL_TYPES = ["E20", "HSD", "ATF", "Ethanol", "Kerosene"];

const InputSearch = () => {
	const route = useRoute<any>();
	const [search, setSearch] = useState("");

	const findScreen = () => {
		if (!search || !search.trim()) return;

		const screenName = route.name;
		const normalizedSearch = search.trim().toLowerCase();

		/* ================= FUELS HOME ================= */
		if (screenName === "fuelsPage") {
			const matchedFuel = FUEL_TYPES.find(
				(fuel) => fuel.toLowerCase() === normalizedSearch,
			);

			if (matchedFuel) {
				console.log("InfoScreen", {
					name: matchedFuel,
				});
			} else {
				Alert.alert("Only fuel-related terms allowed here!");
			}
			return;
		}

		/* =============== INDUSTRIAL HOME =============== */
		if (screenName === "BitumenScreen") {
			const matchedGrade = BITUMEN_GRADES.find(
				(grade) => grade.toLowerCase() === normalizedSearch,
			);
			// const matchedLiquid = Industrial_Liquids.find(
			//   grade => grade.toLowerCase() === normalizedSearch,
			// );

			if (matchedGrade) {
				console.log("InfoScreen", {
					name: matchedGrade, // EXACT JSON VALUE
				});
			} else {
				Alert.alert("Only bitumen-related terms allowed here!");
			}
			return;
		}

		/* ================= GLOBAL SEARCH ================= */
		switch (normalizedSearch) {
			case "bitumen":
			case "bitumens":
			case "products used for road":
				console.log("BitumenScreen");
				break;

			case "fuels":
				console.log("FuelsHome");
				break;

			case "fuel best for bike":
				console.log("InfoScreen", { name: "Petrol" });
				break;

			case "fuel best for trucks":
				console.log("InfoScreen", { name: "Diesel" });
				break;

			case "lpg":
				console.log("LpgScreen");
				break;

			case "industrial":
				console.log("IndustrialScreen");
				break;

			default:
				Alert.alert("Search term not found!");
		}
	};

	const getSearchPlaceholder = () => {
		switch (route.name) {
			case "Pages/homeScreen":
				return "Search Products";
			case "Pages/fuelsPage":
				return "Search Motor Fuel";
			case "Pages/lubricantsPage":
				return "Search Lubricants";
			case "KnowledgeCenter":
				return "Search Tutorials, Tools, Safety";
			case "ExploreMore":
				return "Search Tutorials, Tools, Safety";
			case "Pages/lpgPage":
				return "Search for Lpg";
			case "industrialScreen":
				return "Search Industrial";
			default:
				return "Search Products";
			// return route.name;
		}
	};

	return (
		<View style={styles.searchInputContainer}>
			<View style={styles.inputWrapper}>
				<Ionicons name="search" size={25} color="#888" style={styles.icon} />
				<TextInput
					placeholder={getSearchPlaceholder()}
					style={styles.searchInput}
					placeholderTextColor="#000"
					value={search}
					onChangeText={setSearch}
					onSubmitEditing={() => findScreen()}
					returnKeyType="search" // Optional to change return key to 'search'
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
		shadowOffset: {
			width: 2,
			height: 2,
		},
		elevation: 4,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		width: width / 1.27,
	},
	icon: {
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 18,
		fontWeight: "300",
		paddingVertical: 10,
	},
});
