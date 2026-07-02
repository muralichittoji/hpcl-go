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
  `);
}
