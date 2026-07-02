import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("hpcl.db");

export const initDatabase = () => {
	db.execSync(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      response TEXT,
      productCode TEXT,
      createdAt INTEGER
    );
  
    CREATE INDEX IF NOT EXISTS idx_history_createdAt
    ON search_history(createdAt DESC);
  
    CREATE INDEX IF NOT EXISTS idx_history_question
    ON search_history(question);
  `);
};
