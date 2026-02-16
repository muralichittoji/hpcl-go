import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type ScrollProps = {
	children: React.ReactNode;
	bottom?: number;
	bg?: string;
	verticalSroll?: boolean;
	horizontalScroll?: boolean;
	padding?: number;
};

const ScrollComponent = ({
	children,
	bottom = 60,
	bg = "#EEE",
	verticalSroll = false,
	horizontalScroll = false,
	padding = 0,
}: ScrollProps) => {
	return (
		<View style={styles.container}>
			<ScrollView
				style={{ flex: 1 }}
				showsVerticalScrollIndicator={verticalSroll}
				showsHorizontalScrollIndicator={horizontalScroll}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{
					padding: padding,
					paddingBottom: bottom,
					backgroundColor: bg,
				}}
			>
				{children}
			</ScrollView>
		</View>
	);
};

export default ScrollComponent;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
