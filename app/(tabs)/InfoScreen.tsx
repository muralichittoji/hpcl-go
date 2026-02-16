// Enquiry modal
import EnquireNow from "@/components/Ui/EnquireNow";

// Common header
import Header from "@/components/Ui/Header";
import AppIndustries from "@/components/Ui/Info/AppIndustries";
import ComparisonCard from "@/components/Ui/Info/ComparisonCard";
import DocumentsDownloads from "@/components/Ui/Info/DocumentsDownloads";
import EnquiryShare from "@/components/Ui/Info/EnquiryShare";
import PackagingSupply from "@/components/Ui/Info/PackagingSupply";
import ProductComparison from "@/components/Ui/Info/ProductComparison";
import RelatedProducts from "@/components/Ui/Info/RelatedProducts";
import SpecificationsCard from "@/components/Ui/Info/SpecificationsCard";

// Info screen sections
import ProductPreviewModal from "@/components/Ui/ProductPreviewModal";
import SafeSheet from "@/components/Ui/SafeSheet";

// Static product data
import infoData from "@/constants/Jsons/InfoData.json";
import devData from "@/constants/Jsons/newDevData.json";

// Routing & hooks
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PdfViewerContent from "../PdfViewerContent";

/* -------------------------------------------------------------------------- */
/*                                Info Screen                                 */
/* -------------------------------------------------------------------------- */
const InfoScreen = ({ route }: any) => {
	// Safe area values (bottom inset varies on iOS/Android)
	const insets = useSafeAreaInsets();

	// Read product name from route params
	const params = useLocalSearchParams<{ name?: string }>();
	const name = params.name;

	/* ---------------------------------------------------------------------- */
	/*                 Resolve product data from JSON sources                 */
	/* ---------------------------------------------------------------------- */
	const data = name
		? (infoData[name as keyof typeof infoData] ??
			devData[name as keyof typeof devData])
		: undefined;

	// Enquiry modal visibility
	const [enquireOpen, setEnquireOpen] = useState(false);
	const [openPreview, setOpenPreview] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [openPdf, setOpenPdf] = useState(false);
	const [pdfUrl, setPdfUrl] = useState("");
	const [pdfName, setPdfName] = useState("");

	// Scroll reference (useful for future scroll-to-section logic)
	const scrollRef = useRef<ScrollView>(null);

	/* ---------------------------------------------------------------------- */
	/*                           Data safety guard                              */
	/* ---------------------------------------------------------------------- */
	if (!data) {
		return (
			<View style={styles.container}>
				<Text>Data not found for {name}</Text>
			</View>
		);
	}

	/* ---------------------------------------------------------------------- */
	/*                                  Render                                  */
	/* ---------------------------------------------------------------------- */
	const isComparison = data.specifications?.[0]?.property === "Comparision";
	const compValue = data.specifications?.[0]?.value;
	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
		>
			<View style={{ flex: 1 }}>
				<Header caption={data.title} subCaption={data.subTitle} />
				{/* Scrollable content */}
				<ScrollView
					ref={scrollRef}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{
						paddingBottom:
							Platform.OS === "ios" ? insets.bottom + 100 : insets.bottom + 110,
					}}
				>
					<View style={{ paddingHorizontal: 20 }}>
						{/* Divider */}
						<View style={styles.divider} />

						{/* Product description */}
						<View style={{ margin: 5 }}>
							<Text style={styles.description}>{data.description}</Text>
						</View>

						{/* Specifications */}
						<View>
							{isComparison ? (
								<ComparisonCard value={compValue} />
							) : (
								<SpecificationsCard data={data.specifications} />
							)}
						</View>

						{/* Applicable industries */}
						<View>
							<AppIndustries data={data.appData} />
						</View>

						{/* Packaging & supply details */}
						<View style={{ margin: 10 }}>
							<PackagingSupply data={data.packaging} />
						</View>

						{/* Document downloads */}
						<View>
							<DocumentsDownloads
								data={data}
								loading={loading}
								setOpenPdf={setOpenPdf}
								setPdfUrl={setPdfUrl}
								setPdfName={setPdfName}
							/>
						</View>

						{/* Related products */}
						<View>
							<RelatedProducts Packages={data.related} />
						</View>

						{/* Product comparison */}
						<View>
							<ProductComparison />
						</View>

						{/* Share & enquiry CTA */}
						<View>
							<EnquiryShare
								data={data}
								openEnquire={setEnquireOpen}
								setOpenPreview={setOpenPreview}
							/>
						</View>
					</View>
				</ScrollView>
				{/* Bottom Sheet */}
				<SafeSheet
					visible={openPdf}
					onClose={() => setOpenPdf(false)}
					heightRatio={0.85}
				>
					{pdfUrl && (
						<PdfViewerContent
							pdfUrl={pdfUrl}
							name={pdfName}
							onClose={() => setOpenPdf(false)}
						/>
					)}
				</SafeSheet>
				{/* Enquiry modal */}
				{enquireOpen && (
					<EnquireNow
						title={`Enquire about ${data?.title}`}
						visible={enquireOpen}
						onClose={() => setEnquireOpen(false)}
					/>
				)}
				{openPreview && (
					<ProductPreviewModal
						product={data}
						visible={openPreview}
						onClose={() => setOpenPreview(false)}
					/>
				)}
			</View>
		</KeyboardAvoidingView>
	);
};

export default InfoScreen;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
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
