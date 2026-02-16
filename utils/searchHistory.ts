import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "SEARCH_HISTORY";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export type SearchHistoryItem = {
	id: string;
	question: string;
	answers: string[];
	productCode?: string | null;
	createdAt: number;
};

/* ---------------- AUTO CLEAN EXPIRED ---------------- */
const cleanExpired = (items: SearchHistoryItem[]) => {
	const now = Date.now();
	return items.filter((item) => now - item.createdAt <= ONE_WEEK);
};

/* ---------------- SAVE ---------------- */
export const saveSearchToHistory = async (newItem: SearchHistoryItem) => {
	try {
		const existing = await AsyncStorage.getItem(HISTORY_KEY);
		const parsed: SearchHistoryItem[] = existing ? JSON.parse(existing) : [];

		const cleaned = cleanExpired(parsed);

		const updated = [newItem, ...cleaned];

		await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
	} catch (error) {
		console.log("History save error:", error);
	}
};

/* ---------------- GET ---------------- */
export const getSearchHistory = async (): Promise<SearchHistoryItem[]> => {
	try {
		const data = await AsyncStorage.getItem(HISTORY_KEY);
		const parsed: SearchHistoryItem[] = data ? JSON.parse(data) : [];

		const cleaned = cleanExpired(parsed);

		// Update storage after cleaning
		await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(cleaned));

		return cleaned;
	} catch {
		return [];
	}
};

/* ---------------- DELETE SINGLE ---------------- */
export const deleteHistoryItem = async (id: string) => {
	try {
		const existing = await getSearchHistory();
		const updated = existing.filter((item) => item.id !== id);

		await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
	} catch (error) {
		console.log("Delete error:", error);
	}
};
