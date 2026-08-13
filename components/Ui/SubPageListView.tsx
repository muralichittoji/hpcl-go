import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { MaterialIcons } from "@expo/vector-icons";
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
	items: {
		label: string;
		onPress: () => void;
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
			{/* Banner Section */}
			{bannerIcon && (ALL_IMAGES as any)[bannerIcon] && (
				<View style={styles.bannerContainer}>
					<Image
						source={(ALL_IMAGES as any)[bannerIcon]}
						style={styles.bannerImage}
						resizeMode="contain"
					/>
				</View>
			)}

			{/* List Items */}
			<View style={styles.listContainer}>
				{items.map((item, index) => {
					const isImageIcon = item.iconType === "image" && item.icon;
					const imageSource = isImageIcon
						? (ALL_IMAGES as any)[item.icon!]
						: undefined;

					return (
						<TouchableOpacity
							key={index}
							style={[styles.listItem, isImageIcon && styles.listItemWithImage]}
							activeOpacity={0.9}
							onPress={item.onPress}
						>
							{isImageIcon && imageSource ? (
								<Image
									source={imageSource}
									style={styles.itemImage}
									resizeMode="contain"
								/>
							) : (
								<View style={styles.itemContent}>
									{item.icon && !isImageIcon && (
										<MaterialIcons
											name={item.icon as any}
											size={20}
											color={Colors.blueDeep}
											style={styles.itemIcon}
										/>
									)}
									<Text style={styles.itemLabel}>{item.label}</Text>
								</View>
							)}
							<MaterialIcons
								name="chevron-right"
								size={24}
								color={Colors.blueDeep}
								style={isImageIcon && styles.chevronWithImage}
							/>
						</TouchableOpacity>
					);
				})}
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
						size={32}
						color={Colors.blueDeep}
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{title}</Text>
				<View style={{ width: 32 }} />
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
		backgroundColor: Colors.light.background,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	backButton: {
		padding: 8,
		marginLeft: -8,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: Colors.blueDeep,
		flex: 1,
		textAlign: "center",
	},
	scrollView: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
	bannerContainer: {
		width: "100%",
		height: 200,
		overflow: "hidden",
		backgroundColor: "#f0f0f0",
	},
	bannerImage: {
		width: "100%",
		height: "100%",
		backgroundColor: Colors.blueDark,
	},
	listContainer: {
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 20,
		gap: 5,
	},
	listItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 12,
		marginVertical: 6,
		backgroundColor: "#fff",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 3,
		shadowOffset: { width: 0, height: 1 },
		elevation: 2,
	},
	itemContent: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	itemIcon: {
		marginRight: 12,
	},
	itemLabel: {
		fontSize: 16,
		fontWeight: "700",
		color: Colors.blueDeep,
	},
	listItemWithImage: {
		flexDirection: "column",
		paddingVertical: 12,
		paddingHorizontal: 8,
		gap: 8,
	},
	itemImage: {
		width: "100%",
		height: 80,
		marginBottom: 8,
	},
	chevronWithImage: {
		position: "absolute",
		top: 8,
		right: 8,
	},
});
