import { EventEmitter } from "eventemitter3";

export const notificationEmitter = new EventEmitter();
export type AppNotification = {
	id: number;
	chatId: number;
	title: string;
	message: string;
	type: "success" | "error" | "info";
	read: boolean;
	createdAt: number;
};

let notifications: AppNotification[] = [];

let nextNotificationId = 1;

export const addNotification = (
	chatId: number,
	title: string,
	message: string,
	type: "success" | "error",
) => {
	const notification: AppNotification = {
		id: nextNotificationId++,
		chatId,
		title,
		message,
		type,
		read: false,
		createdAt: Date.now(),
	};

	notifications.unshift(notification);

	notificationEmitter.emit("changed");

	return notification;
};

export const getNotifications = () => {
	return notifications;
};

export const markAsRead = (id: number) => {
	notifications = notifications.map((n) =>
		n.id === id ? { ...n, read: true } : n,
	);

	notificationEmitter.emit("changed");
};

export const clearNotifications = () => {
	notifications = [];
	nextNotificationId = 1;

	notificationEmitter.emit("changed");
};

export const getUnreadCount = () => {
	return notifications.filter((n) => !n.read).length;
};
