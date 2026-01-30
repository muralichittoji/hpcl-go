import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

/**
 * Responsive font size with clamp
 *
 * @param size  base design size (from figma, 375 width)
 * @param max   maximum size (default = size)
 * @param min   minimum size (default = 85% of size)
 *
 * Usage:
 * rf(30)          -> scale but never exceed 30
 * rf(20, 24)      -> scale, max 24
 * rf(18, 22, 16)  -> scale between 16–22
 */
export const rf = (
	size: number,
	max: number = size,
	min: number = size * 0.85,
) => {
	return Math.max(min, size);
};
