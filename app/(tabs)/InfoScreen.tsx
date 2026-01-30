import EnquireNow from "@/components/Ui/EnquireNow";
import Header from "@/components/Ui/Header";
import AppIndustries from "@/components/Ui/Info/AppIndustries";
import DocumentsDownloads from "@/components/Ui/Info/DocumentsDownloads";
import EnquiryShare from "@/components/Ui/Info/EnquiryShare";
import PackagingSupply from "@/components/Ui/Info/PackagingSupply";
import ProductComparison from "@/components/Ui/Info/ProductComparison";
import RelatedProducts from "@/components/Ui/Info/RelatedProducts";
import SpecificationsCard from "@/components/Ui/Info/SpecificationsCard";

import devData from "@/constants/Jsons/devData.json";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const InfoScreen = ({ route }: any) => {
	const insets = useSafeAreaInsets();

	const params = useLocalSearchParams<{ name?: string }>();
	const name = params.name;

	const data = name ? devData[name as keyof typeof devData] : undefined;

	const [enquireOpen, setEnquireOpen] = useState(false);

	const scrollRef = useRef<ScrollView>(null);

	if (!data) {
		return (
			<View style={styles.container}>
				<Text>Data not found for {name}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View>
				<Header caption={data.title} subCaption={data.subTitle} />
				<ScrollView
					showsVerticalScrollIndicator={false}
					ref={scrollRef}
					contentContainerStyle={{
						paddingBottom:
							Platform.OS === "ios" ? insets.bottom + 120 : insets.bottom + 140,
					}}
				>
					<View style={{ paddingHorizontal: 20 }}>
						{/* Divider */}
						<View style={styles.divider} />

						{/* Description */}
						<View style={{ margin: 5 }}>
							<Text style={styles.description}>{data.description}</Text>
						</View>

						<View>
							<SpecificationsCard data={data.specifications} />
						</View>

						<View>
							<AppIndustries data={data.appData} />
						</View>
						<View style={{ margin: 10 }}>
							<PackagingSupply data={data.packaging} />
						</View>
						<View>
							<DocumentsDownloads data={data} />
						</View>
						<View>
							<RelatedProducts Packages={data.related} />
						</View>
						<View>
							<ProductComparison />
						</View>
						<View>
							<EnquiryShare data={data} openEnquire={setEnquireOpen} />
						</View>
					</View>
				</ScrollView>
			</View>
			{enquireOpen && (
				<EnquireNow
					title={`Enquire about ${data?.title}`}
					visible={enquireOpen}
					onClose={() => setEnquireOpen(false)}
				/>
			)}
		</View>
	);
};

export default InfoScreen;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		flex: 1,
	},

	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},

	checkCircle: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#CBD5E1",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
	},

	checkText: {
		fontSize: 14,
		color: "#1E3A8A",
		fontWeight: "bold",
	},

	headerText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#0F172A",
	},

	contentRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},

	textSection: {
		flex: 1,
		paddingRight: 12,
	},

	title: {
		fontSize: 22,
		fontWeight: "700",
		color: "#0F172A",
		marginBottom: 6,
	},

	subTitle: {
		fontSize: 14,
		color: "#475569",
	},

	icon: {
		fontSize: 48,
		color: "#334155",
	},

	divider: {
		height: 1,
		backgroundColor: "#E2E8F0",
		marginVertical: 16,
	},

	description: {
		fontSize: 16,
		color: "#334155",
		lineHeight: 20,
		textAlign: "justify",
	},
});
