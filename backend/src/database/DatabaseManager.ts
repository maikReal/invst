import { Database } from "bun:sqlite";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

class DatabaseManager {
  private static instance: DatabaseManager;
  private db!: any;

  private constructor() {}

  public static async getInstance(): Promise<DatabaseManager> {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
      await DatabaseManager.instance.init();
    }
    return DatabaseManager.instance;
  }

  // Initialize SQLite3 Database
  private async init() {
    await this.createFolderIfNotExsit();

    this.db = new Database("./database/wallets.db");

    // Create Table for Wallet Data
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        ciphertext TEXT NOT NULL,
        data_hash TEXT NOT NULL
      );
    `);

    console.log("✅ SQLite Database Initialized");
  }

  private async createFolderIfNotExsit() {
    const DB_FOLDER = path.resolve("./database");
    if (!fs.existsSync(DB_FOLDER)) {
      fs.mkdirSync(DB_FOLDER, { recursive: true });
      console.log("✅ Created database folder:", DB_FOLDER);
    }
  }

  // Store Encrypted Wallet Data
  public async storeWalletData(
    userId: string,
    ciphertext: string,
    dataHash: string
  ): Promise<void> {
    const stmt = await this.db
      .prepare(`INSERT INTO user_wallets (user_id, ciphertext, data_hash) VALUES (?, ?, ?) 
      ON CONFLICT(user_id) DO UPDATE SET ciphertext = ?, data_hash = ?`);

    await stmt.run(userId, ciphertext, dataHash, ciphertext, dataHash);
    console.log(`✅ Stored wallet data for User: ${userId}`);
  }

  // Retrieve Encrypted Wallet Data
  public async getWalletData(
    userId: string
  ): Promise<{ ciphertext: string; dataHash: string } | null> {
    const stmt = await this.db.prepare(
      "SELECT ciphertext, data_hash FROM user_wallets WHERE user_id = ?"
    );

    const row = await stmt.get(userId);

    if (!row) {
      console.log(`❌ No wallet found for User: ${userId}`);
      return null;
    }

    console.log(`🔑 Retrieved wallet data for User: ${userId}`);
    return row;
  }
}

export default DatabaseManager;
