import { db } from "./dataBase";

export interface SearchHistoryItem {
	id: number;
	question: string;
	response: string | null;
	productCode: string | null;
	createdAt: number;
}

/* ---------------- INSERT ---------------- */

export const insertQuestion = (question: string): number => {
	// Check if the question already exists
	const existing = db.getFirstSync<{ id: number }>(
		`SELECT id
		 FROM search_history
		 WHERE LOWER(question)=LOWER(?)
		 LIMIT 1`,
		[question],
	);

	// If found, delete it so it can be reinserted at the top
	if (existing) {
		db.runSync(
			`DELETE FROM search_history
			 WHERE id=?`,
			[existing.id],
		);
	}

	db.runSync(
		`INSERT INTO search_history(
			question,
			createdAt
		)
		VALUES(?, ?)`,
		[question, Date.now()],
	);

	const row = db.getFirstSync<{ id: number }>(
		`SELECT last_insert_rowid() as id`,
	);

	return row?.id ?? 0;
};
/* ---------------- UPDATE ---------------- */

export const updateAnswer = (
	id: number,
	response: string,
	productCode: string | null,
) => {
	console.log("Saving to SQLite:", {
		id,
		productCode,
	});

	db.runSync(
		`UPDATE search_history
		 SET response=?,
		     productCode=?
		 WHERE id=?`,
		[response, productCode, id],
	);
};
/* ---------------- GET ALL ---------------- */

export const getHistory = (): SearchHistoryItem[] => {
	return db.getAllSync<SearchHistoryItem>(
		`SELECT *
		 FROM search_history
		 ORDER BY createdAt DESC`,
	);
};

/* ---------------- GET ONE ---------------- */

export const getHistoryById = (id: number): SearchHistoryItem | null => {
	return (
		db.getFirstSync<SearchHistoryItem>(
			`SELECT *
			 FROM search_history
			 WHERE id=?`,
			[id],
		) ?? null
	);
};

/* ---------------- DELETE ONE ---------------- */

export const deleteHistory = (id: number) => {
	db.runSync(
		`DELETE
		 FROM search_history
		 WHERE id=?`,
		[id],
	);
};

/* ---------------- DELETE ALL ---------------- */

export const clearHistory = () => {
	db.runSync(`DELETE FROM search_history`);
};

/* ---------------- Auto suggestions ALL ---------------- */

export const searchHistory = (text: string): SearchHistoryItem[] => {
	return db.getAllSync<SearchHistoryItem>(
		`SELECT *
		 FROM search_history
		 WHERE question LIKE ?
		 ORDER BY createdAt DESC
		 LIMIT 10`,
		[`%${text}%`],
	);
};

/* ---------------- Remove old History ---------------- */
export const removeOldHistory = (days = 30) => {
	const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

	db.runSync(
		`DELETE
		 FROM search_history
		 WHERE createdAt < ?`,
		[cutoff],
	);
};
