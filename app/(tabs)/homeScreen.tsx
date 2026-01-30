import CommonModal from "@/components/Ui/CommonModal";
import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import LoadingOverlay from "@/components/Ui/LoadingOverlay";
import UnifiedListMenu from "@/components/Ui/UnifiedListMenu";
import wholeData from "@/constants/Jsons/newData.json";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import React, { useState } from "react";

import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
	// Navigation
	const navigate = (itemName: any) => {
		switch (itemName) {
			case "Knowledge\nCenter":
				router.push("/KnowledgeCenter");
				break;
			case "Product\nFinder":
				router.push("/ProductFinder");
				break;
			case "Explore More":
				router.push("/ExploreMore");
				break;
			default:
				router.push({
					pathname: "/SubPage",
					params: { title: itemName.name },
				});
				break;
		}
	};

	const [loading, setLoading] = useState(false);
	const [slowNet, setSlowNet] = useState(false);

	// const [deviceUUID, setDeviceUUID] = useState<string | null>(null);
	// useEffect(() => {
	// 	const loadUUID = async () => {
	// 		const uuid = await SecureStore.getItemAsync("DEVICE_UUID");
	// 		setDeviceUUID(uuid);
	// 	};

	// 	loadUUID();
	// }, []);

	return (
		<View style={styles.container}>
			<Header caption={"Product \nCatalogue"} />
			<InputSearch setLoading={setLoading} setSlowNet={setSlowNet} />
			<ScrollView
				contentContainerStyle={{
					paddingBottom: 30,
				}}
				showsVerticalScrollIndicator={false}
			>
				<View>
					<UnifiedListMenu
						items={wholeData?.homeScreen}
						navigate={navigate}
						showIcons
						itemHeight={170}
					/>
				</View>
				<View>
					<Text style={styles.content}>Quick Help</Text>
					<UnifiedListMenu
						items={wholeData.quickHelp}
						navigate={navigate}
						showIcons
						itemHeight={70}
					/>
				</View>
				{/* <TouchableOpacity onPress={() => navigate("Explore More")}>
					<Text style={styles.exploreBtn}>Explore More {"->"}</Text>
				</TouchableOpacity> */}
			</ScrollView>
			<LoadingOverlay visible={loading} text="Thinking..." />
			<CommonModal
				visible={slowNet}
				title="Slow Internet"
				message="Your connection is too slow. Please try again."
				icon="speedometer-outline"
				buttonText="Retry"
				onPress={() => setSlowNet(false)}
			/>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	subContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		color: Colors.blueDark,
		fontSize: 20,
		fontWeight: "900",
		marginHorizontal: 10,
		marginTop: 20,
	},
	logo: {
		width: 120,
		height: 120,
		margin: 10,
	},
	itemContainer: {
		display: "flex",
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
		display: "flex",
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
