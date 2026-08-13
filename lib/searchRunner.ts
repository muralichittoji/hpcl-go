import { addMessage, updateChatId } from "@/lib/chat";
import { addNotification } from "@/lib/notification";
import {
	showSearchCompletedNotification,
	showSearchFailedNotification,
} from "@/lib/pushNotifications";
import { getApiErrorMessage, isAbortError } from "@/utils/apiErrors";
import { getAnswer } from "@/utils/authService";
import { safeParse } from "@/utils/jsonUtils";
import { EventEmitter } from "eventemitter3";

export type SearchTaskStatus = "idle" | "running" | "success" | "error" | "stopped";

export type SearchTask = {
	chatId: number;
	userMessageId: number;
	question: string;
	status: SearchTaskStatus;
	errorMessage?: string;
	startedAt: number;
	finishedAt?: number;
};

export const searchTaskEmitter = new EventEmitter();

const tasks = new Map<number, SearchTask>();
const controllers = new Map<number, AbortController>();

const emitChanged = (chatId: number) => {
	searchTaskEmitter.emit("changed", chatId);
};

const finishTask = (chatId: number, patch: Partial<SearchTask>) => {
	const existing = tasks.get(chatId);
	if (!existing) return;

	const nextTask: SearchTask = {
		...existing,
		...patch,
		finishedAt: Date.now(),
	};

	tasks.set(chatId, nextTask);
	controllers.delete(chatId);
	emitChanged(chatId);
};

export const getSearchTask = (chatId: number) => {
	return tasks.get(chatId) ?? null;
};

export const isSearchRunning = (chatId: number) => {
	return tasks.get(chatId)?.status === "running";
};

export const stopSearchTask = (chatId: number) => {
	controllers.get(chatId)?.abort();
};

export const runSearchTask = async ({
	chatId,
	userMessageId,
	question,
	isOnline,
}: {
	chatId: number;
	userMessageId: number;
	question: string;
	isOnline: boolean;
}) => {
	const existing = tasks.get(chatId);

	if (existing?.status === "running") {
		return existing;
	}

	const controller = new AbortController();
	controllers.set(chatId, controller);

	const task: SearchTask = {
		chatId,
		userMessageId,
		question,
		status: "running",
		startedAt: Date.now(),
	};

	tasks.set(chatId, task);
	emitChanged(chatId);

	try {
		const res = await getAnswer({
			question,
			signal: controller.signal,
		});

		const rawAnswer = res?.results?.[0]?.answer;

		if (!rawAnswer) {
			const errorMessage = "Network Failure, Please wait or try again later";
			finishTask(chatId, {
				status: "error",
				errorMessage,
			});
			addNotification(chatId, "Search Failed", question, "error");
			showSearchFailedNotification(chatId, "Search Failed", question);
			return tasks.get(chatId);
		}

		if (typeof rawAnswer === "string" && rawAnswer.trim().startsWith("<")) {
			const errorMessage =
				"Server error: Invalid response format. Please try again.";
			finishTask(chatId, {
				status: "error",
				errorMessage,
			});
			addNotification(chatId, "Search Failed", question, "error");
			showSearchFailedNotification(chatId, "Search Failed", question);
			return tasks.get(chatId);
		}

		const parsed = safeParse(rawAnswer);
		const finalResponse = parsed?.response ?? rawAnswer ?? "No response available";
		const productCode = parsed?.app_product_code ?? null;

		addMessage(
			chatId,
			"assistant",
			finalResponse,
			productCode,
			res?.results?.[0]?.queryId ?? null,
		);

		if (res?.chatId) {
			updateChatId(chatId, res.chatId);
		}

		finishTask(chatId, {
			status: "success",
			errorMessage: undefined,
		});
		addNotification(chatId, "Search Complete", question, "success");
		showSearchCompletedNotification(chatId, "Search Complete", question);
		return tasks.get(chatId);
	} catch (error: unknown) {
		if (isAbortError(error)) {
			finishTask(chatId, {
				status: "stopped",
				errorMessage: "Search stopped by user.",
			});
			addNotification(chatId, "Search Stopped", question, "error");
			showSearchFailedNotification(chatId, "Search Stopped", question);
			return tasks.get(chatId);
		}

		const errorMessage = getApiErrorMessage(error, isOnline);
		finishTask(chatId, {
			status: "error",
			errorMessage,
		});
		addNotification(chatId, "Search Failed", question, "error");
		showSearchFailedNotification(chatId, "Search Failed", question);
		return tasks.get(chatId);
	}
};
