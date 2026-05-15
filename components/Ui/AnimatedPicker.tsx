import { Colors } from "@/constants/theme";
import React from "react";
import {
	LayoutAnimation,
	Platform,
	StyleSheet,
	Text,
	UIManager,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

if (Platform.OS === "android") {
	UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = {
	label: string;
	open: boolean;
	value: string | null;
	items: { label: string; value: string }[];

	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setValue: React.Dispatch<any>;

	placeholder?: string;
	disabled?: boolean;
	closeOthers?: () => void;
	zIndex?: number;
	zIndexInverse?: number;
};

const AnimatedPicker = ({
	label,
	open,
	value,
	items,
	setOpen,
	setValue,
	placeholder,
	disabled,
	closeOthers,
	zIndex,
	zIndexInverse,
}: Props) => {
	const animate = () =>
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

	const handleOpen: React.Dispatch<React.SetStateAction<boolean>> = (val) => {
		animate();
		closeOthers?.();

		if (typeof val === "function") {
			setOpen((prev) => val(prev));
		} else {
			setOpen(val);
		}
	};

	return (
		<View style={[styles.wrapper, { zIndex: zIndex ?? 1000 }]}>
			<Text style={styles.label}>{label}</Text>

			<DropDownPicker
				open={open}
				value={value}
				items={items}
				setOpen={handleOpen}
				setValue={setValue}
				placeholder={placeholder}
				disabled={disabled}
				listMode="SCROLLVIEW"
				style={styles.dropdown}
				dropDownContainerStyle={styles.dropdownContainer}
				zIndex={zIndex}
				zIndexInverse={zIndexInverse}
			/>
		</View>
	);
};

export default AnimatedPicker;

const styles = StyleSheet.create({
	wrapper: {
		paddingHorizontal: 20,
	},
	label: {
		marginBottom: 6,
		fontSize: 14,
		fontWeight: "600",
		color: Colors.black,
	},
	dropdown: {
		borderColor: "#E5E7EB",
		borderRadius: 8,
		minHeight: 48,
	},
	dropdownContainer: {
		borderColor: "#E5E7EB",
	},
});
