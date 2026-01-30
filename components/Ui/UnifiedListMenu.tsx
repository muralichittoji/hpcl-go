import devData from "@/constants/Jsons/devData.json";
import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { FontAwesome } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
	Dimensions,
	Image,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const getColumns = () => {
	if (width < 350) return 2;
	if (width < 600) return 3;
	return 4;
};

type UnifiedListMenuProps = {
	items: any[];
	navigate: (item: any) => void;
	itemHeight: number;

	// Optional features
	scrollable?: boolean;
	showIcons?: boolean;
	getIcons?: (item: any) => any;
	showInfo?: boolean;
	useItemName?: boolean;
};

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
	const insets = useSafeAreaInsets();
	const scrollRef = useRef<ScrollView>(null);

	const [modalVisible, setModalVisible] = useState(false);
	const [selectedItem, setSelectedItem] = useState<any>(null);

	const backgroundColorSet = [
		Colors.blueLight,
		Colors.greenLight,
		Colors.orangeLight,
		Colors.blueDeep,
		Colors.orangeRed,
		Colors.purple,
	];

	type ImageKey = keyof typeof ALL_IMAGES;

	const getBackgroundColor = (index: number) =>
		backgroundColorSet[index % backgroundColorSet.length];

	const columns = getColumns();
	const shouldPopup = items.length % 2 !== 0;

	const isLastItem = (index: number) =>
		shouldPopup && index === items.length - 1;

	/* ---- Modal helpers (Page 3) ---- */
	const getProduct = (key?: string) =>
		key ? (devData[key as keyof typeof devData] ?? null) : null;

	const getDesc = (key?: string) =>
		getProduct(key)?.description ?? "No description available";

	const getTitle = (key?: string) =>
		getProduct(key)?.title ?? "No description available";

	const getSubTitle = (key?: string) =>
		getProduct(key)?.subTitle ?? "No description available";

	const openInfo = (item: any) => {
		setSelectedItem(item);
		setModalVisible(true);
	};

	const Content = (
		<View style={styles.row}>
			{items.map((item: any, index: number) => {
				const last = isLastItem(index);
				const png = item.iconType === "image";

				const label = useItemName ? item.name : item.name;
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
								height: last ? itemHeight - 60 : itemHeight,
								width: last ? width - 30 : width / columns + 45,
								paddingHorizontal: 15,
								backgroundColor: getBackgroundColor(index),
								flexDirection: png && !last ? "column" : "row",
								gap: 10,
								justifyContent: "center",
								alignItems: "center",
								alignSelf: last ? "center" : "auto",
							},
						]}
					>
						{/* Icons (Page 1) */}
						{item.iconType === "image" &&
							item.icon &&
							ALL_IMAGES[item.icon as ImageKey] && (
								<Image
									source={ALL_IMAGES[item.icon as ImageKey]}
									style={{
										height: last ? 65 : 95,
										width: last ? 65 : 95,
									}}
									resizeMode="contain"
								/>
							)}

						{item.iconType === "vector" && typeof item.icon === "string" && (
							<FontAwesome name={item.icon} color="#fff" size={25} />
						)}

						{/* Info Button (Page 3) */}
						{showInfo && (
							<Pressable
								onPress={() => openInfo(item)}
								onPressIn={(e) => e.stopPropagation()}
								style={styles.infoBtn}
							>
								<Text style={styles.infoText}>i</Text>
							</Pressable>
						)}

						{/* Text */}
						<Text
							numberOfLines={2}
							adjustsFontSizeToFit
							minimumFontScale={0.65}
							style={[
								styles.text,
								{
									fontSize: !useItemName
										? Math.min(width * 0.055, 20)
										: Math.min(width * 0.07, 25),
								},
							]}
						>
							{label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);

	return (
		<View>
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

			{/* Modal (Page 3) */}
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

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-around",
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
		fontWeight: "800",
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
