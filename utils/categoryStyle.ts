import { Colors } from "@/constants/theme";

export const CATEGORY_BACKGROUND_COLORS = [
	Colors.blueLight,
	Colors.greenLight,
	Colors.orangeLight,
	Colors.blueSky,
	Colors.pink,
	Colors.purple,
];

export const CATEGORY_BACKGROUND_OPACITY = 0.09;

export const withHexOpacity = (hex: string, opacity: number) => {
	const clean = hex.replace("#", "").slice(0, 6);
	const alpha = Math.round(opacity * 255)
		.toString(16)
		.padStart(2, "0");
	return `#${clean}${alpha}`;
};

export const getCategoryBackground = (
	index = 0,
	opacity = CATEGORY_BACKGROUND_OPACITY,
) =>
	withHexOpacity(
		CATEGORY_BACKGROUND_COLORS[index % CATEGORY_BACKGROUND_COLORS.length],
		opacity,
	);
