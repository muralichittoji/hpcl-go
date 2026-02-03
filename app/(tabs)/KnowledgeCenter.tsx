import CommonModal from "@/components/Ui/CommonModal";
import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import wholeData from "@/constants/Jsons/wholeData.json";
import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";

const KnowledgeCenter = () => {
	const [loading, setLoading] = useState(false);
	const [slowNet, setSlowNet] = useState(false);

	const { width } = useWindowDimensions();
	const MIN_ITEM_WIDTH = 160;
	const SPACING = 15;

	const columns = Math.max(2, Math.floor(width / MIN_ITEM_WIDTH));
	const itemWidth = (width - SPACING * (columns + 1)) / columns;

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
				return ALL_IMAGES.DRUMS_ICON;
			case "Fire & Combustion":
				return ALL_IMAGES.FIRE_ICON;
			case "Lubricants & Maintenance":
				return ALL_IMAGES.LIQUID_ICON;
			case "Safety & Heading":
				return ALL_IMAGES.SHIELD_ICON;
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
			<Header caption={"Knowledge \n Center"} />
			<InputSearch
				setLoading={setLoading}
				setSlowNet={setSlowNet}
				placeHolder="Search"
			/>
			<LoadingOverlay visible={loading} text="Analyzing..." />

			<CommonModal
				visible={slowNet}
				title="Slow Internet"
				message="Backend Servers are at full swing. Please try again."
				icon="speedometer-outline"
				buttonText="Retry"
				onPress={() => setSlowNet(false)}
			/>
			<View>
				<View style={styles.row}>
					{wholeData.Knowledge.map((item: any, index: number) => (
						<TouchableOpacity
							key={index}
							onPress={() => navigate(item)}
							style={[
								styles.item,
								{
									height: 180,
									width: itemWidth,
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
							<View style={{ paddingHorizontal: 5 }}>
								<Text style={styles.text}>{item}</Text>
								<Text style={{ fontWeight: "500" }}>{getSubText(item)}</Text>
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
		justifyContent: "center",
		gap: 20,
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
		justifyContent: "flex-start",
		flexWrap: "wrap",
		marginHorizontal: 10,
		marginBottom: 10,
	},
	item: {
		height: 190,
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
