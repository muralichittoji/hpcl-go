import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import Header from "@/components/Ui/Header";
import InputSearch from "@/components/Ui/InputSearch";
import wholeData from "@/constants/Jsons/wholeData.json";
import { Colors } from "@/constants/theme";

/* -------------------- Types -------------------- */
type PickerJSON = {
	[industry: string]: {
		[application: string]: {
			[condition: string]: string[];
		};
	};
};

/* -------------------- Component -------------------- */
const ProductFinder = () => {
	const router = useRouter();
	const pickerData = wholeData.PICKER_DATA as PickerJSON;

	/* ---------- Industry ---------- */
	const [industryOpen, setIndustryOpen] = useState(false);
	const [industry, setIndustry] = useState<string | null>(null);

	const industryItems = useMemo(
		() =>
			Object.keys(pickerData).map((item) => ({
				label: item,
				value: item,
			})),
		[pickerData],
	);

	/* ---------- Application ---------- */
	const [applicationOpen, setApplicationOpen] = useState(false);
	const [application, setApplication] = useState<string | null>(null);

	const [loading, setLoading] = useState(false);
	const [slowNet, setSlowNet] = useState(false);

	const applicationItems = useMemo(() => {
		if (!industry) return [];
		return Object.keys(pickerData[industry] ?? {}).map((item) => ({
			label: item,
			value: item,
		}));
	}, [industry, pickerData]);

	/* ---------- Condition ---------- */
	const [conditionOpen, setConditionOpen] = useState(false);
	const [condition, setCondition] = useState<string | null>(null);

	const conditionItems = useMemo(() => {
		if (!industry || !application) return [];
		return Object.keys(pickerData[industry]?.[application] ?? {}).map(
			(item) => ({
				label: item,
				value: item,
			}),
		);
	}, [industry, application, pickerData]);

	/* ---------- Products ---------- */
	const products = useMemo(() => {
		if (!industry || !application || !condition) return [];

		const raw = pickerData[industry]?.[application]?.[condition] ?? [];

		return raw.flatMap((item) =>
			item.includes("/") ? item.split("/").map((v) => v.trim()) : [item],
		);
	}, [industry, application, condition, pickerData]);

	/* -------------------- UI -------------------- */
	return (
		<View style={styles.container}>
			<Header caption={"Product \n Finder"} />
			<InputSearch setLoading={setLoading} setSlowNet={setSlowNet} />

			<ScrollView
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ paddingBottom: 60 }}
			>
				<View style={styles.inner}>
					{/* Industry */}
					<Text style={styles.label}>Industry</Text>
					<DropDownPicker
						open={industryOpen}
						value={industry}
						items={industryItems}
						setOpen={setIndustryOpen}
						setValue={setIndustry}
						placeholder="Select Industry"
						listMode="SCROLLVIEW"
						onChangeValue={() => {
							setApplication(null);
							setCondition(null);
						}}
						zIndex={3000}
						zIndexInverse={1000}
					/>

					{/* Application */}
					<Text style={styles.label}>Application</Text>
					<DropDownPicker
						open={applicationOpen}
						value={application}
						items={applicationItems}
						setOpen={setApplicationOpen}
						setValue={setApplication}
						placeholder="Select Application"
						disabled={!industry}
						listMode="SCROLLVIEW"
						style={styles.dropdown}
						dropDownContainerStyle={styles.dropdownContainer}
						zIndex={2000}
						zIndexInverse={2000}
					/>

					{/* Condition */}
					<Text style={styles.label}>Operating Conditions</Text>
					<DropDownPicker
						open={conditionOpen}
						value={condition}
						items={conditionItems}
						setOpen={setConditionOpen}
						setValue={setCondition}
						placeholder="Select Condition"
						disabled={!application}
						listMode="SCROLLVIEW"
						style={styles.dropdown}
						dropDownContainerStyle={styles.dropdownContainer}
						zIndex={1000}
						zIndexInverse={3000}
					/>

					{/* Results */}
					{products.map((product) => (
						<LinearGradient
							key={product}
							colors={[Colors.blueDeep, Colors.blueLight]}
							style={styles.productCard}
						>
							<Text style={styles.productTitle}>{product}</Text>
							<Text style={styles.productDesc}>
								Eligible / Recommended Product
							</Text>

							<View style={styles.buttonRow}>
								<TouchableOpacity
									style={styles.outlineBtn}
									onPress={() =>
										router.push({
											pathname: "/InfoScreen",
											params: { name: product },
										})
									}
								>
									<Text style={styles.outlineText}>View Specifications</Text>
								</TouchableOpacity>

								<TouchableOpacity style={styles.outlineBtn}>
									<Text style={styles.outlineText}>Enquire</Text>
								</TouchableOpacity>
							</View>
						</LinearGradient>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

export default ProductFinder;

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	inner: {
		paddingHorizontal: 20,
	},
	label: {
		marginTop: 20,
		marginBottom: 6,
		fontSize: 14,
		fontWeight: "600",
		color: Colors.black,
	},
	dropdown: {
		borderColor: "#E5E7EB",
		borderRadius: 8,
		minHeight: 48,
	},
	dropdownContainer: {
		borderColor: "#E5E7EB",
	},
	productCard: {
		marginTop: 12,
		padding: 16,
		borderRadius: 12,
	},
	productTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#fff",
	},
	productDesc: {
		marginTop: 6,
		fontSize: 14,
		color: "#E5E7EB",
	},
	buttonRow: {
		flexDirection: "row",
		marginTop: 14,
	},
	outlineBtn: {
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginRight: 10,
	},
	outlineText: {
		color: "#fff",
		fontSize: 13,
		fontWeight: "600",
	},
});
