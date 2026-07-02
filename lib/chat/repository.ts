import { getDb } from "@/lib/database";

import type { Chat, Message, PaginatedResult } from "./types";

export type { Chat, Message, PaginatedResult } from "./types";

export const CHAT_PAGE_SIZE = 20;
export const MESSAGE_PAGE_SIZE = 30;

/* -------------------------------------------------------------------------- */
/*                               CREATE CHAT                                  */
/* -------------------------------------------------------------------------- */

export const createChat = (
	title: string,
	chatId: string | null = null,
): number => {
	const db = getDb();
	const now = Date.now();

	db.runSync(
		`
		INSERT INTO chats(
			chatId,
			title,
			createdAt,
			updatedAt
		)
		VALUES (?, ?, ?, ?)
		`,
		[chatId, title, now, now],
	);

	const row = db.getFirstSync<{ id: number }>(
		`SELECT last_insert_rowid() AS id`,
	);

	return row?.id ?? 0;
};

/* -------------------------------------------------------------------------- */
/*                          UPDATE SERVER CHAT ID                             */
/* -------------------------------------------------------------------------- */

export const updateChatId = (localChatId: number, serverChatId: string) => {
	getDb().runSync(
		`
		UPDATE chats
		SET chatId = ?
		WHERE id = ?
		`,
		[serverChatId, localChatId],
	);
};

/* -------------------------------------------------------------------------- */
/*                           UPDATE CHAT TIMESTAMP                            */
/* -------------------------------------------------------------------------- */

export const touchChat = (localChatId: number) => {
	getDb().runSync(
		`
		UPDATE chats
		SET updatedAt = ?
		WHERE id = ?
		`,
		[Date.now(), localChatId],
	);
};

/* -------------------------------------------------------------------------- */
/*                              INSERT MESSAGE                                */
/* -------------------------------------------------------------------------- */

export const addMessage = (
	chatLocalId: number,
	role: "user" | "assistant",
	text: string,
	productCode: string | null = null,
	queryId: string | null = null,
): number => {
	const db = getDb();

	db.runSync(
		`
		INSERT INTO messages(
			chatLocalId,
			role,
			text,
			productCode,
			queryId,
			createdAt
		)
		VALUES (?, ?, ?, ?, ?, ?)
		`,
		[chatLocalId, role, text, productCode, queryId, Date.now()],
	);

	const row = db.getFirstSync<{ id: number }>(
		`SELECT last_insert_rowid() AS id`,
	);

	touchChat(chatLocalId);

	return row?.id ?? 0;
};

/* -------------------------------------------------------------------------- */
/*                              GET ONE CHAT                                  */
/* -------------------------------------------------------------------------- */

export const getChat = (localChatId: number): Chat | null => {
	return (
		getDb().getFirstSync<Chat>(
			`
			SELECT *
			FROM chats
			WHERE id = ?
			`,
			[localChatId],
		) ?? null
	);
};

/* -------------------------------------------------------------------------- */
/*                           GET CHATS (PAGINATED)                            */
/* -------------------------------------------------------------------------- */

export const getChatsPage = (
	offset = 0,
	limit = CHAT_PAGE_SIZE,
): PaginatedResult<Chat> => {
	const db = getDb();

	const total =
		db.getFirstSync<{ count: number }>(`SELECT COUNT(*) AS count FROM chats`)
			?.count ?? 0;

	const items = db.getAllSync<Chat>(
		`
		SELECT *
		FROM chats
		ORDER BY updatedAt DESC
		LIMIT ? OFFSET ?
		`,
		[limit, offset],
	);

	return {
		items,
		hasMore: offset + items.length < total,
	};
};

/* -------------------------------------------------------------------------- */
/*                         GET MESSAGES (PAGINATED)                           */
/* -------------------------------------------------------------------------- */

/** Loads the most recent messages first (for initial screen render). */
export const getRecentMessagesPage = (
	localChatId: number,
	limit = MESSAGE_PAGE_SIZE,
): PaginatedResult<Message> => {
	const db = getDb();

	const total =
		db.getFirstSync<{ count: number }>(
			`
			SELECT COUNT(*) AS count
			FROM messages
			WHERE chatLocalId = ?
			`,
			[localChatId],
		)?.count ?? 0;

	const rows = db.getAllSync<Message>(
		`
		SELECT *
		FROM messages
		WHERE chatLocalId = ?
		ORDER BY createdAt DESC
		LIMIT ?
		`,
		[localChatId, limit],
	);

	return {
		items: rows.reverse(),
		hasMore: rows.length < total,
	};
};

/** Loads older messages before a given message id (scroll-up pagination). */
export const getOlderMessagesPage = (
	localChatId: number,
	beforeMessageId: number,
	limit = MESSAGE_PAGE_SIZE,
): PaginatedResult<Message> => {
	const db = getDb();

	const rows = db.getAllSync<Message>(
		`
		SELECT *
		FROM messages
		WHERE chatLocalId = ?
		  AND id < ?
		ORDER BY createdAt DESC
		LIMIT ?
		`,
		[localChatId, beforeMessageId, limit],
	);

	return {
		items: rows.reverse(),
		hasMore: rows.length === limit,
	};
};

/* -------------------------------------------------------------------------- */
/*                               DELETE CHAT                                  */
/* -------------------------------------------------------------------------- */

export const deleteChat = (localChatId: number) => {
	getDb().runSync(
		`
		DELETE FROM chats
		WHERE id = ?
		`,
		[localChatId],
	);
};

/* -------------------------------------------------------------------------- */
/*                               CLEAR CHATS                                  */
/* -------------------------------------------------------------------------- */

export const clearChats = () => {
	const db = getDb();
	db.runSync(`DELETE FROM messages`);
	db.runSync(`DELETE FROM chats`);
};

/* -------------------------------------------------------------------------- */
/*                              GET PREVIOUS CHATS                            */
/* -------------------------------------------------------------------------- */

export const getPreviousUserMessage = (
	assistantMessageId: number,
): Message | null => {
	return (
		getDb().getFirstSync<Message>(
			`
			SELECT *
			FROM messages
			WHERE id < ?
			  AND role = 'user'
			ORDER BY id DESC
			LIMIT 1
			`,
			[assistantMessageId],
		) ?? null
	);
};

/* -------------------------------------------------------------------------- */
/*                              UPDATE MESSAGE                                */
/* -------------------------------------------------------------------------- */

export const updateMessage = (
	id: number,
	text: string,
	productCode: string | null,
	queryId: string | null,
) => {
	getDb().runSync(
		`
		UPDATE messages
		SET
			text = ?,
			productCode = ?,
			queryId = ?
		WHERE id = ?
		`,
		[text, productCode, queryId, id],
	);
};
