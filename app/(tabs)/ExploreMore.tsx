import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import UnifiedListMenu from "@/components/Ui/UnifiedListMenu";
import React from "react";
import { StyleSheet, View } from "react-native";

const data = [
	"Product Finder",
	"Tools & Calculators",
	"Knowledge Center",
	"FAQs & Safety Hub",
];
const ExploreMore = () => {
	return (
		<View style={styles.container}>
			<Header caption="Interactive Tools" />
			<InputSearch />
			<View style={styles.subContainer}>
				<UnifiedListMenu
					items={data}
					itemHeight={170}
					png={true}
					navigate={() => {}}
				/>
			</View>
		</View>
	);
};

export default ExploreMore;

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	subContainer: {
		// paddingHorizontal: 20,
	},
});
