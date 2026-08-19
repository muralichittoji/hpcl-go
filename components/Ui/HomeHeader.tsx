import { Colors } from "@/constants/theme";
import { ALL_IMAGES } from "@/hooks/Allimages";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

interface HomeHeaderProps {
	title?: string;
}

const HomeHeader = ({ title }: HomeHeaderProps) => {
	const { width } = useWindowDimensions();
	const insets = useSafeAreaInsets();
	const bannerHeight = 128 + insets.top;

	return (
		<View style={styles.wrap}>
			<LinearGradient
				colors={["#CCE3FA", "#D8A2C7", "#ED3B50"]}
				locations={[0, 0.5, 1]}
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 0 }}
				style={[styles.banner, { height: bannerHeight, width }]}
			>
				{/* <Image
					source={ALL_IMAGES.OUTLET_ICON}
					style={[
						styles.station,
						{ width: width * 0.54, height: bannerHeight / 2 },
					]}
					resizeMode="cover"
				/> */}

				<View
					style={[
						styles.brandRow,
						{
							paddingTop: Math.max(insets.top, 12) + 8,
							width,
						},
					]}
				>
					<Image
						source={ALL_IMAGES.MASTER_LOGO}
						style={styles.logo}
						resizeMode="contain"
					/>
					<View style={styles.titleBlock}>
						{/* <Text style={styles.title}>HPCL</Text> */}
						<Text style={styles.title}>{"Product \nCatalogue"}</Text>
					</View>
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

				<Svg
					width={width}
					height={54}
					viewBox="0 0 250 54"
					preserveAspectRatio="none"
					style={styles.wave}
					pointerEvents="none"
				>
					{/* <Path
						d="M0 22 C 70 48, 150 8, 230 28 C 300 44, 350 18, 400 32 L 400 54 L 0 54 Z"
						fill="#7ec4e8"
					/> */}
					<Path
						d="M0 38 C 90 18, 170 50, 260 36 C 330 24, 370 46, 400 54 L 0 54 Z"
						fill="#ffffff"
					/>
				</Svg>
			</LinearGradient>

			{/* <View style={styles.sectionHead}> */}
			{/* <Text style={styles.sectionTitle}>{title ? title : ""}</Text> */}
			{/* <View style={styles.sectionAccent} /> */}
			{/* </View> */}
		</View>
	);
};

export default HomeHeader;

const styles = StyleSheet.create({
	wrap: {
		backgroundColor: "#fff",
	},
	banner: {
		overflow: "hidden",
	},
	station: {
		position: "absolute",
		right: 0,
		bottom: 15,
		opacity: 0.2,
	},
	background: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	brandRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 14,
		gap: 10,
		// zIndex: 2,
	},
	logo: {
		width: 58,
		height: 72,
		backgroundColor: "#fff",
		// borderWidth: 1.5,
		// borderColor: Colors.blueDeep,
	},
	titleBlock: {
		flex: 1,
		justifyContent: "flex-end",
	},
	searchButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		color: Colors.blueDark,
		fontSize: 28,
		fontWeight: "600",
		letterSpacing: 0.3,
		lineHeight: 38,
		// marginTop: 20,
	},
	subtitle: {
		color: Colors.blueDark,
		fontSize: 16,
		fontWeight: "600",
		marginTop: 2,
	},
	wave: {
		position: "absolute",
		left: 0,
		bottom: 0,
	},
	sectionHead: {
		paddingHorizontal: 16,
		paddingTop: 10,
		paddingBottom: 8,
	},
	sectionTitle: {
		color: Colors.blueDark,
		fontSize: 20,
		fontWeight: "800",
	},
	sectionAccent: {
		width: 42,
		height: 3,
		borderRadius: 2,
		backgroundColor: Colors.orangeRed,
		marginTop: 6,
	},
});
