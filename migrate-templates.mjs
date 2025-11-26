import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log("Creating templates table...");

try {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(64) NOT NULL,
      jobType VARCHAR(64) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      promptTemplate TEXT NOT NULL,
      sampleContent TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  
  console.log("✓ templates table created successfully");
} catch (error) {
  console.error("Error creating templates table:", error);
  process.exit(1);
}

await connection.end();
console.log("Migration completed");
