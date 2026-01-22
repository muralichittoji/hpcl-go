import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import wholeData from "@/constants/Jsons/wholeData.json";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import React from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const BitumenIcon = "@/assets/images/icons/road-construction.png";
const FireIcon = "@/assets/images/icons/fire-solid.png";
const ShieldIcon = "@/assets/images/icons/shield-solid.png";
const WaterIcon = "@/assets/images/icons/Waterproofing.png";

const { width } = Dimensions.get("window");
const getColumns = () => {
	if (width < 350) {
		return 2;
	} else if (width < 600) {
		return 3;
	} else {
		return 4;
	}
};

const KnowledgeCenter = () => {
	const columns = getColumns();

	const navigate = (itemName: string) => {
		switch (itemName) {
			case "Bitumen & roads":
				router.push({
					pathname: "/InfoScreen",
					params: { name: "VG-10" },
				});
				break;
			default:
				break;
		}
	};

	const getIcons = (itemName: string) => {
		switch (itemName) {
			case "Bitumen & Roads":
				return require(BitumenIcon);
			case "Fire & Combustion":
				return require(FireIcon);
			case "Lubricants & Maintenance":
				return require(WaterIcon);
			case "Safety & Heading":
				return require(ShieldIcon);
			default:
				return "#D1D5DB";
		}
	};
	const getBackgroundColor = (itemName: string) => {
		switch (itemName) {
			case "Bitumen & Roads":
				return Colors.orangeLight;
			case "Fire & Combustion":
				return Colors.orangeRed;
			case "Lubricants & Maintenance":
				return Colors.blueLight;
			case "Safety & Heading":
				return Colors.greenBright;
			default:
				return "#D1D5DB";
		}
	};
	const getSubText = (itemName: string) => {
		switch (itemName) {
			case "Bitumen & Roads":
				return ".VG Grades Explained\n.PMB vd CRMB";
			case "Fire & Combustion":
				return ".Flash Point basics\n.Furnace Oil vs diesel";
			case "Lubricants & Maintenance":
				return ".What is viscosity?\n.ISO VG grades";
			case "Safety & Heading":
				return ".PPE\n.Storage condtions";
			default:
				return "#D1D5DB";
		}
	};

	return (
		<View style={styles.container}>
			<Header caption="Knowledge Center" />
			<InputSearch />
			<View>
				<View style={styles.row}>
					{wholeData.Knowledge.map((item: any, index: number) => (
						<TouchableOpacity
							key={index}
							onPress={() => navigate(item)}
							style={[
								styles.item,
								{
									height: 170,
									width: width / columns + 50,

									flexDirection: "column",
								},
							]}
						>
							<View
								style={{
									backgroundColor: getBackgroundColor(item),
									width: "100%",
									borderTopLeftRadius: 10,
									borderTopRightRadius: 10,
									alignItems: "center",
									padding: 5,
								}}
							>
								<Image
									source={getIcons(item)}
									style={[styles.icons]}
									width={60}
								/>
							</View>
							<View style={{ paddingHorizontal: 20 }}>
								<Text style={styles.text}>{item}</Text>
								<Text>{getSubText(item)}</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</View>
		</View>
	);
};

export default KnowledgeCenter;

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	subContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 20,
	},
	content: {
		textAlign: "center",
		color: Colors.blueDark,
		fontSize: 30,
		fontWeight: "500",
	},
	logo: {
		width: 70,
		height: 70,
		margin: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 10,
		flexWrap: "wrap",
	},
	item: {
		height: 170,
		alignItems: "center",
		backgroundColor: "#FFF",
		margin: 5,
		borderRadius: 10,
	},
	text: {
		textAlign: "center",
		fontSize: 20,
		color: Colors.blueDark,
		fontWeight: "700",
		marginBottom: 5,
	},
	icons: {
		width: 60,
		height: 60,
		color: "white",
	},
	button: {
		width: "95%",
		height: 80,
		backgroundColor: Colors.blueDark,
		padding: 10,
		marginHorizontal: 10,
		borderRadius: 10,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 30,
	},
});
