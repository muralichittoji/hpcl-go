import { initDatabase } from "@/lib/database";
import {
	getInitialNotificationChatId,
	registerForPushNotifications,
	setupNotificationNavigation,
} from "@/lib/pushNotifications";
import { NetworkProvider } from "@/utils/NetworkProvider";
import * as Notifications from "expo-notifications";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import { CopilotProvider } from "react-native-copilot";
import "react-native-reanimated";

// disable font scaling globally (TS safe)
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	useEffect(() => {
		const subscription = setupNotificationNavigation((chatId) => {
			router.push({
				pathname: "/(tabs)/ResultScreen",
				params: {
					chatLocalId: chatId.toString(),
				},
			});
		});

		return () => subscription.remove();
	}, []);

	useEffect(() => {
		const chatId = getInitialNotificationChatId();

		if (chatId) {
			router.replace({
				pathname: "/(tabs)/ResultScreen",
				params: {
					chatLocalId: chatId.toString(),
				},
			});
		}
	}, []);

	useEffect(() => {
		try {
			initDatabase();
		} catch (e) {
			console.log("Database init failed", e);
		}
	}, []);

	useEffect(() => {
		registerForPushNotifications();
	}, []);

	return (
		<CopilotProvider>
			<NetworkProvider>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen
						name="modal"
						options={{ presentation: "modal", title: "Modal" }}
					/>
					<Stack.Screen name="pdf-preview" options={{ headerShown: false }} />
				</Stack>
				<StatusBar style="light" />
			</NetworkProvider>
		</CopilotProvider>
	);
}
