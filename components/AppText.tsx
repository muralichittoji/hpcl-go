import React from "react";
import { Text, TextProps } from "react-native";

type Props = TextProps & {
	lines?: number;
};

export default function AppText({ lines, style, children, ...rest }: Props) {
	return (
		<Text
			allowFontScaling={false}
			numberOfLines={lines}
			ellipsizeMode={lines ? "tail" : undefined}
			style={style}
			{...rest}
		>
			{children}
		</Text>
	);
}
