import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 生成履歴テーブル
 * ユーザーが生成した職務経歴書の最適化結果を保存
 */
export const resumes = mysqlTable("resumes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  resumeText: text("resumeText").notNull(),
  jobDescription: text("jobDescription").notNull(),
  generatedContent: text("generatedContent").notNull(), // JSON string
  customItems: text("customItems"), // JSON string for custom field definitions
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = typeof resumes.$inferInsert;

/**
 * APIキー設定テーブル
 * ユーザーごとのAPIキー（暗号化して保存）
 */
export const apiKeys = mysqlTable("apiKeys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(), // ユーザーごとに1つのAPIキー
  encryptedOpenAIKey: text("encryptedOpenAIKey"), // 暗号化されたOpenAI APIキー
  encryptedGeminiKey: text("encryptedGeminiKey"), // 暗号化されたGemini APIキー
  primaryProvider: varchar("primaryProvider", { length: 64 }).notNull().default("gemini"), // メインのプロバイダー（gemini, openai）
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;