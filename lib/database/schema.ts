import type * as SQLite from "expo-sqlite";

export function runMigrations(db: SQLite.SQLiteDatabase) {
	db.execSync(`
    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chatId TEXT,
      title TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chatLocalId INTEGER NOT NULL,
      role TEXT NOT NULL,
      text TEXT NOT NULL,
      productCode TEXT,
      queryId TEXT,
      createdAt INTEGER NOT NULL,

      FOREIGN KEY(chatLocalId)
        REFERENCES chats(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_chat
      ON messages(chatLocalId);

    CREATE INDEX IF NOT EXISTS idx_messages_created
      ON messages(createdAt);

    CREATE INDEX IF NOT EXISTS idx_chats_updated
      ON chats(updatedAt DESC);

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      code TEXT PRIMARY KEY,
      productId INTEGER NOT NULL,
      title TEXT NOT NULL,
      subTitle TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      MSDS TEXT NOT NULL DEFAULT '',
      appData TEXT NOT NULL DEFAULT '',
      sbu TEXT NOT NULL DEFAULT '',
      industrial TEXT NOT NULL DEFAULT '',
      documentation TEXT NOT NULL DEFAULT '',
      specifications TEXT NOT NULL DEFAULT '[]',
      packaging TEXT NOT NULL DEFAULT '[]',
      alternatives TEXT NOT NULL DEFAULT '[]',
      related TEXT NOT NULL DEFAULT '[]',
      category TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_products_category
      ON products(category);

    CREATE INDEX IF NOT EXISTS idx_products_title
      ON products(title);

    CREATE INDEX IF NOT EXISTS idx_products_sbu
      ON products(sbu);
  `);

	// Migration: Rename msds column to MSDS if it exists
	try {
		// Check if the old column exists
		const columns = db.getAllSync<{ name: string }>(
			`PRAGMA table_info(products)`
		);
		const hasOldColumn = columns.some((col) => col.name === 'msds');
		const hasNewColumn = columns.some((col) => col.name === 'MSDS');

		if (hasOldColumn && !hasNewColumn) {
			db.execSync(`ALTER TABLE products RENAME COLUMN msds TO MSDS`);
		}
	} catch (error) {
		// If migration fails, continue anyway
		console.warn('Migration failed:', error);
	}
}
