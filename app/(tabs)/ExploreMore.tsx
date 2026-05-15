import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import UnifiedListMenu from "@/components/Ui/UnifiedListMenu";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const data = [
	{
		id: "1",
		name: "Product Finder",
		icon: "COMPASS_ICON",
		iconType: "image",
	},
	{
		id: "2",
		name: "Tools & Calculators",
		icon: "CALCULATOR_ICON",
		iconType: "image",
	},
	{
		id: "3",
		name: "Knowledge Center",
		icon: "BROUCHER_ICON",
		iconType: "image",
	},
	{
		id: "4",
		name: "FAQs & Safety Hub",
		icon: "SHIELD_ICON",
		iconType: "image",
	},
];

const ExploreMore = () => {
	const [loading, setLoading] = useState(false);
	const [slowNet, setSlowNet] = useState(false);

	return (
		<View style={styles.container}>
			<Header caption="Interactive Tools" />
			<InputSearch setLoading={setLoading} setSlowNet={setSlowNet} />
			<View style={styles.subContainer}>
				<UnifiedListMenu
					items={data}
					showIcons
					itemHeight={170}
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
