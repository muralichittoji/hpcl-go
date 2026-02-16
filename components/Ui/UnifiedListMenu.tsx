// Local JSON data used to populate modal info (Page 3)
import newDevData from "@/constants/Jsons/newDevData.json";

// App theme colors
import { Colors } from "@/constants/theme";

// Centralized image map (string key → require image)
import { ALL_IMAGES } from "@/hooks/Allimages";

// Vector icons
import { FontAwesome } from "@expo/vector-icons";

import React, { useEffect, useRef, useState } from "react";
import {
	Image,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from "react-native";

// Safe area handling (notch, home indicator, etc.)
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* -------------------------------------------------------------------------- */
/*                                Props Type                                  */
/* -------------------------------------------------------------------------- */
type UnifiedListMenuProps = {
	items: any[]; // List data to render
	navigate: (item: any) => void; // Navigation handler
	itemHeight: number; // Height of each tile

	// Optional feature flags
	scrollable?: boolean; // Enable vertical scrolling
	showIcons?: boolean; // Show icons (image/vector)
	getIcons?: (item: any) => any; // Optional icon resolver
	showInfo?: boolean; // Show info modal button
	useItemName?: boolean; // Controls font sizing logic
};

/* -------------------------------------------------------------------------- */
/*                              Main Component                                 */
/* -------------------------------------------------------------------------- */
const UnifiedListMenu = ({
	items,
	navigate,
	itemHeight,
	scrollable = false,
	showIcons = false,
	getIcons,
	showInfo = false,
	useItemName = false,
}: UnifiedListMenuProps) => {
	// Safe-area padding
	const insets = useSafeAreaInsets();

	// ScrollView ref (future scroll control if needed)
	const scrollRef = useRef<ScrollView>(null);

	// Modal state
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedItem, setSelectedItem] = useState<any>(null);

	// Screen width for responsive layout
	const { width } = useWindowDimensions();

	// Layout constants
	const MIN_ITEM_WIDTH = 160;
	const SPACING = 15;

	// Calculate number of columns based on screen width
	const columns = Math.max(2, Math.floor(width / MIN_ITEM_WIDTH));

	// Calculate item width dynamically
	const itemWidth = (width - SPACING * (columns + 1)) / columns;

	/* ---------------------------- Background Colors --------------------------- */
	const backgroundColorSet = [
		Colors.blueLight,
		Colors.greenLight,
		Colors.orangeLight,
		Colors.blueDeep,
		Colors.orangeRed,
		Colors.purple,
	];

	// Valid image keys from ALL_IMAGES
	type ImageKey = keyof typeof ALL_IMAGES;

	// Rotate background colors
	const getBackgroundColor = (index: number) =>
		backgroundColorSet[index % backgroundColorSet.length];

	/* ---------------------- Odd item → full width logic ----------------------- */
	const shouldPopup = items.length % 2 !== 0;

	const isLastItem = (index: number) =>
		shouldPopup && index === items.length - 1;

	/* -------------------------------------------------------------------------- */
	/*                           Modal helper functions                            */
	/* -------------------------------------------------------------------------- */

	// Fetch product object from JSON

	const getProduct = (key?: string) =>
		key ? newDevData[key as keyof typeof newDevData] : null;

	useEffect(() => {});
	const getDesc = (key?: string) => {
		console.log("KEY =>", key);
		console.log("TYPE =>", typeof key);
		console.log("ALL KEYS =>", Object.keys(newDevData));
		console.log("MATCH =>", Object.keys(newDevData).includes(key!));
		return getProduct(key)?.description ?? "No description available";
	};

	const getTitle = (key?: string) =>
		getProduct(key)?.title ?? "No description available";

	const getSubTitle = (key?: string) =>
		getProduct(key)?.subTitle ?? "No description available";

	// Open info modal
	const openInfo = (item: any) => {
		setSelectedItem(item);
		setModalVisible(true);
	};

	const toTitleCase = (text: string) => {
		return text
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	/* -------------------------------------------------------------------------- */
	/*                                Menu Content                                 */
	/* -------------------------------------------------------------------------- */
	const Content = (
		<View style={styles.row}>
			{items.map((item: any, index: number) => {
				const last = isLastItem(index);
				const png = item.iconType === "image";

				// Label text
				const label = useItemName ? item.name : item.name;

				// Decide navigation payload
				const navigatePlace = item?.navigation
					? item.name
					: showInfo
						? item.data
						: item;

				return (
					<TouchableOpacity
						key={index}
						activeOpacity={0.85}
						onPress={() => navigate(navigatePlace)}
						style={[
							styles.item,
							{
								// Full-width layout for last odd item
								height: last ? itemHeight - 60 : itemHeight,
								width: last ? width - 30 : itemWidth,
								paddingHorizontal: 15,
								backgroundColor: getBackgroundColor(index),
								padding: showIcons ? 10 : 3,

								// Image tiles stack vertically
								flexDirection: png && !last ? "column" : "row",
								gap: png ? 10 : 5,

								justifyContent: "center",
								alignItems: "center",
								alignSelf: last ? "center" : "auto",
							},
						]}
					>
						{/* -------------------------- Image Icon -------------------------- */}
						{item.iconType === "image" &&
							item.icon &&
							ALL_IMAGES[item.icon as ImageKey] && (
								<Image
									source={ALL_IMAGES[item.icon as ImageKey]}
									style={{
										height: last ? 65 : 95,
										width: last ? 65 : 85,
									}}
									resizeMode="contain"
								/>
							)}

						{/* -------------------------- Vector Icon ------------------------- */}
						{item.iconType === "vector" && typeof item.icon === "string" && (
							<FontAwesome name={item.icon} color="#fff" size={25} />
						)}

						{/* -------------------------- Info Button ------------------------- */}
						{showInfo && (
							<Pressable
								onPress={() => openInfo(item)}
								// Prevent navigation trigger
								onPressIn={(e) => e.stopPropagation()}
								style={styles.infoBtn}
							>
								<Text style={styles.infoText}>i</Text>
							</Pressable>
						)}

						{/* -------------------------- Label Text -------------------------- */}
						<Text
							numberOfLines={4} // allow up to 4 lines
							ellipsizeMode="tail"
							style={[
								styles.text,
								{
									fontSize: !useItemName
										? Math.min(width * 0.055, 20)
										: Math.min(width * 0.07, 23),
								},
							]}
						>
							{toTitleCase(label)}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Render                                   */
	/* -------------------------------------------------------------------------- */
	return (
		<View>
			{/* Scrollable / Static Layout */}
			{scrollable ? (
				<ScrollView
					ref={scrollRef}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: insets.bottom + 250 }}
				>
					{Content}
				</ScrollView>
			) : (
				Content
			)}

			{/* ----------------------------- Info Modal ----------------------------- */}
			{showInfo && (
				<Modal
					transparent
					animationType="fade"
					visible={modalVisible}
					onRequestClose={() => setModalVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>
								{getTitle(selectedItem?.data)}
							</Text>

							<Text>{getSubTitle(selectedItem?.data)}</Text>

							<View style={styles.divider} />

							<Text style={styles.modalDesc}>
								{getDesc(selectedItem?.data)}
							</Text>

							<Pressable
								style={styles.closeBtn}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.closeText}>Close</Text>
							</Pressable>
						</View>
					</View>
				</Modal>
			)}
		</View>
	);
};

export default UnifiedListMenu;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "flex-start",
		flexWrap: "wrap",
		marginHorizontal: 10,
		marginBottom: 10,
	},

	item: {
		justifyContent: "center",
		alignItems: "center",
		margin: 5,
		borderRadius: 12,
		padding: 10,
		shadowColor: "#444",
		shadowOpacity: 0.3,
		shadowRadius: 3,
		shadowOffset: { width: 1, height: 1 },
	},

	text: {
		color: "white",
		fontWeight: "600",
		textAlign: "center",
	},

	icons: {
		width: 65,
		height: 65,
	},

	/* Info Button */
	infoBtn: {
		position: "absolute",
		top: 6,
		right: 6,
		height: 26,
		width: 26,
		borderRadius: 13,
		backgroundColor: "rgba(255,255,255,0.9)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 10,
	},

	infoText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#000",
	},

	/* Modal */
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},

	modalContent: {
		width: "85%",
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
	},

	modalTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: Colors.blueDark,
	},

	modalDesc: {
		fontSize: 16,
		color: "#444",
		marginBottom: 20,
		textAlign: "justify",
	},

	closeBtn: {
		alignSelf: "flex-end",
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: Colors.blueDeep,
		borderRadius: 6,
	},

	closeText: {
		color: "#fff",
		fontWeight: "600",
	},

	divider: {
		height: 2,
		backgroundColor: Colors.gray,
		marginVertical: 10,
	},
});
