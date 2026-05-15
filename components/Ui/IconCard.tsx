import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type Props = {
	label: string;
	onPress: () => void;
	backgroundColor: string;
	height: number;
	width: number;
	icon: any;
	png?: boolean;
	isLast?: boolean;
};

const { width: screenWidth } = Dimensions.get("window");

const IconCard = ({
	label,
	onPress,
	backgroundColor,
	height,
	width,
	icon,
	png,
	isLast,
}: Props) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.85}
			style={[
				styles.item,
				{
					height,
					width,
					flexDirection: png && !isLast ? "column" : "row",
					justifyContent: "center",
					gap: isLast ? 0 : 10,
					alignSelf: isLast ? "center" : "auto",
					backgroundColor,
				},
			]}
		>
			{png ? (
				<View style={{ width: isLast ? 65 : 95, height: isLast ? 65 : 95 }}>
					<Image source={icon} style={styles.icons} resizeMode="contain" />
				</View>
			) : (
				<FontAwesome name={icon} color="#fff" size={20} />
			)}

			<Text
				numberOfLines={2}
				adjustsFontSizeToFit
				minimumFontScale={0.65}
				style={[
					styles.text,
					{
						textAlign: png && !isLast ? "center" : "left",
						width: png && !isLast ? "100%" : "75%",
					},
				]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);
};

export default IconCard;

const styles = StyleSheet.create({
	item: {
		shadowColor: "#444",
		shadowOpacity: 0.2,
		shadowRadius: 2,
		shadowOffset: { width: 1, height: 1 },
		alignItems: "center",
		margin: 5,
		borderRadius: 12,
		padding: 10,
	},
	text: {
		color: "white",
		fontWeight: "700",
		fontSize: Math.min(screenWidth * 0.055, 20),
	},
	icons: {
		height: "100%",
		width: "100%",
	},
});
