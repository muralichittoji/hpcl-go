import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Show notification even when app is foregrounded
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export async function registerForPushNotifications() {
	if (!Device.isDevice) return null;

	const { status: existingStatus } = await Notifications.getPermissionsAsync();

	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		console.log("Notification permission denied");
		return null;
	}

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "Default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	// Skip push token registration for Expo Go compatibility
	// Local notifications work without push tokens
	// Uncomment below if using development build for remote push notifications
	// const token = (await Notifications.getExpoPushTokenAsync()).data;
	// console.log("Expo Push Token:", token);
	// return token;

	return null;
}

export async function showSearchCompletedNotification(
	chatId: number,
	title: string,
	body: string,
) {
	try {
		await Notifications.scheduleNotificationAsync({
			content: {
				title,
				body,
				sound: true,
				data: {
					type: "search",
					chatId,
				},
			},
			trigger: null,
		});
	} catch (e) {
		console.log("Failed to schedule notification", e);
	}
}

export function setupNotificationNavigation(
	onNotificationPress: (chatId: number) => void,
) {
	return Notifications.addNotificationResponseReceivedListener((response) => {
		const data = response.notification.request.content.data;

		if (!data) return;

		const chatId = Number(data.chatId);

		if (Number.isNaN(chatId)) return;

		onNotificationPress(chatId);
	});
}

type NotificationData = {
	chatId: number;
	type: "search";
};

export function getInitialNotificationChatId() {
	const response = Notifications.getLastNotificationResponse();

	if (!response) return null;

	const data = response.notification.request.content.data as
		| NotificationData
		| undefined;

	if (!data) return null;

	return data.chatId;
}
