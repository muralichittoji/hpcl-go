import * as SQLite from "expo-sqlite";

import { seedProductsIfNeeded } from "@/lib/products/seed";

import { runMigrations } from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

/** Opens the database, runs migrations, and seeds product data on first access. */
export function getDb(): SQLite.SQLiteDatabase {
	if (!db) {
		db = SQLite.openDatabaseSync("hpcl.db");
		runMigrations(db);
		seedProductsIfNeeded(db);
	}

	return db;
}

/** Warm up the database during app startup. */
export function initDatabase() {
	getDb();
}

export function reloadDb() {
	db?.closeSync(); // if supported
	db = SQLite.openDatabaseSync("hpcl.db");
	return db;
}
