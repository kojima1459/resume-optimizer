import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

async function migrate() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    console.log("Starting migration...");

    // Add new columns
    await connection.execute(`
      ALTER TABLE apiKeys 
      ADD COLUMN encryptedOpenAIKey TEXT,
      ADD COLUMN encryptedGeminiKey TEXT,
      ADD COLUMN primaryProvider VARCHAR(64) NOT NULL DEFAULT 'gemini'
    `);

    console.log("New columns added");

    // Migrate existing data from encryptedKey to encryptedOpenAIKey
    await connection.execute(`
      UPDATE apiKeys 
      SET encryptedOpenAIKey = encryptedKey
      WHERE encryptedKey IS NOT NULL
    `);

    console.log("Data migrated from encryptedKey to encryptedOpenAIKey");

    // Drop old columns
    await connection.execute(`
      ALTER TABLE apiKeys 
      DROP COLUMN encryptedKey,
      DROP COLUMN keyType
    `);

    console.log("Old columns dropped");
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
