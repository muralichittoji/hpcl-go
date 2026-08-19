import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
	Animated,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingOverlay from "./LoadingOverlay";

/* -------------------------------------------------------------------------- */
/*                              Props Type                                    */
/* -------------------------------------------------------------------------- */
type SubPageListViewProps = {
	title: string;
	bannerIcon?: string;
	centerBanner?: boolean;
	items: {
		label: string;
		onPress: () => void;
		hasValue?: boolean;
		icon?: string;
		iconType?: "image" | "vector";
	}[];
	loading?: boolean;
	loadingText?: string;
	scrollable?: boolean;
};

/* -------------------------------------------------------------------------- */
/*                          Main Component                                    */
/* -------------------------------------------------------------------------- */
const SubPageListView: React.FC<SubPageListViewProps> = ({
	title,
	bannerIcon,
	centerBanner = false,
	items,
	loading = false,
	loadingText = "Loading...",
	scrollable = true,
}) => {
	const scrollY = useRef(new Animated.Value(0)).current;

	const handleBackPress = () => {
		router.back();
	};

	/* ------ Content Renderer ------ */
	const ListContent = (
		<View style={styles.content}>
			{bannerIcon && (ALL_IMAGES as any)[bannerIcon] && (
				<View
					style={[
						styles.bannerContainer,
						centerBanner && styles.bannerContainerCentered,
					]}
				>
					<Image
						source={(ALL_IMAGES as any)[bannerIcon]}
						style={centerBanner ? styles.bannerIcon : styles.bannerImage}
						resizeMode={centerBanner ? "contain" : "cover"}
					/>
				</View>
			)}

			<View style={styles.listContainer}>
				{items.map((item, index) => (
					<TouchableOpacity
						key={index}
						style={styles.listItem}
						activeOpacity={item.hasValue === false ? 1 : 0.9}
						onPress={item.hasValue === false ? undefined : item.onPress}
						disabled={item.hasValue === false}
					>
						<Text style={styles.itemLabel}>{item.label}</Text>
						{item.hasValue !== false && (
							<MaterialIcons
								name="chevron-right"
								size={28}
								color={Colors.blueDeep}
							/>
						)}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			{/* Header with Back Button and Title */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={handleBackPress}
					style={styles.backButton}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<MaterialIcons
						name="chevron-left"
						size={38}
						color={Colors.blueDeep}
					/>
				</TouchableOpacity>
				<View
					style={{
						width: "90%",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Text style={styles.headerTitle}>{title}</Text>
					<TouchableOpacity
						style={styles.searchButton}
						onPress={() => router.push("/SearchScreen")}
						hitSlop={10}
						accessibilityRole="button"
						accessibilityLabel="Search products"
					>
						<Ionicons name="search" size={24} color={Colors.blueDark} />
					</TouchableOpacity>
				</View>
			</View>

			{/* Scrollable Content or Static Content */}
			{scrollable ? (
				<Animated.ScrollView
					scrollEventThrottle={16}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: scrollY } } }],
						{ useNativeDriver: false },
					)}
					style={styles.scrollView}
				>
					{ListContent}
				</Animated.ScrollView>
			) : (
				ListContent
			)}

			<LoadingOverlay visible={loading} text={loadingText} />
		</SafeAreaView>
	);
};

export default SubPageListView;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f6f8",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 16,
		backgroundColor: "#fff",
	},
	backButton: {
		padding: 4,
		marginLeft: -8,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "600",
		color: Colors.blueDeep,
		flex: 1,
		textAlign: "center",
	},
	searchButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	scrollView: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
	bannerContainer: {
		marginHorizontal: 16,
		marginTop: 12,
		height: 180,
		borderRadius: 14,
		overflow: "hidden",
		backgroundColor: "#fff",
	},
	bannerImage: {
		width: "100%",
		height: "100%",
	},
	bannerContainerCentered: {
		alignItems: "center",
		justifyContent: "center",
	},
	bannerIcon: {
		width: 140,
		height: 140,
		alignSelf: "center",
	},
	listContainer: {
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 20,
		gap: 12,
	},
	listItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#fff",
		paddingVertical: 18,
		paddingHorizontal: 16,
		borderRadius: 14,
		minHeight: 64,
	},
	itemLabel: {
		flex: 1,
		fontSize: 16,
		fontWeight: "700",
		color: Colors.blueDeep,
		paddingRight: 8,
	},
});
