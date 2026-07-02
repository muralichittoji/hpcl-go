import { initDatabase } from "@/utils/dataBase";
import { NetworkProvider } from "@/utils/NetworkProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import { CopilotProvider } from "react-native-copilot";
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
	// useEffect(() => {
	// 	ScreenCapture.preventScreenCaptureAsync();

	// 	return () => {
	// 		ScreenCapture.allowScreenCaptureAsync();
	// 	};
	// }, []);

	useEffect(() => {
		initDatabase();
	}, []);

	return (
		<SafeAreaProvider style={{ flex: 1 }}>
			<CopilotProvider>
				<NetworkProvider>
					<Stack>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen
							name="modal"
							options={{ presentation: "modal", title: "Modal" }}
						/>
						<Stack.Screen name="pdf-preview" options={{ headerShown: false }} />
						<Stack.Screen
							name="PdfViewerScreen"
							options={{ headerShown: false }}
						/>
					</Stack>
					<StatusBar style="light" />
				</NetworkProvider>
			</CopilotProvider>
		</SafeAreaProvider>
	);
}
