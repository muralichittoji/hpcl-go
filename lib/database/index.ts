import * as SQLite from "expo-sqlite";

import { runMigrations } from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

/** Opens the database and runs migrations on first access. */
export function getDb(): SQLite.SQLiteDatabase {
	if (!db) {
		db = SQLite.openDatabaseSync("hpcl.db");
		runMigrations(db);
	}

	return db;
}

/** Warm up the database during app startup. */
export function initDatabase() {
	getDb();
}
