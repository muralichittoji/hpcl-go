export interface Chat {
	id: number;
	chatId: string | null;
	title: string;
	createdAt: number;
	updatedAt: number;
}

export interface Message {
	id: number;
	chatLocalId: number;
	role: "user" | "assistant";
	text: string;
	productCode: string | null;
	queryId: string | null;
	createdAt: number;
}

export interface PaginatedResult<T> {
	items: T[];
	hasMore: boolean;
}
