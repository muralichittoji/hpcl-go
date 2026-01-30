import { NetworkProvider } from "@/utils/NetworkProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TextInput } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

// disable font scaling globally (TS safe)
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	return (
		<SafeAreaProvider style={{ flex: 1 }}>
			<NetworkProvider>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen
						name="modal"
						options={{ presentation: "modal", title: "Modal" }}
					/>
				</Stack>
				<StatusBar style="light" />
			</NetworkProvider>
		</SafeAreaProvider>
	);
}
