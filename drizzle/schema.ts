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
  evaluationScore: int("evaluationScore"), // AI評価スコア（0-100）
  evaluationDetails: text("evaluationDetails"), // 評価詳細（JSON string）
  isFavorite: int("isFavorite").notNull().default(0), // お気に入りフラグ（0: 通常, 1: お気に入り）
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

/**
 * 業界別・職種別テンプレートテーブル
 * 業界や職種ごとの最適なフォーマットとサンプルを保存
 */
export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 64 }).notNull(), // 業界（IT, finance, manufacturing, sales, marketing）
  jobType: varchar("jobType", { length: 64 }).notNull(), // 職種（engineer, manager, analyst, designer）
  name: varchar("name", { length: 255 }).notNull(), // テンプレート名
  description: text("description").notNull(), // テンプレートの説明
  promptTemplate: text("promptTemplate").notNull(), // LLMに渡すプロンプトテンプレート
  sampleContent: text("sampleContent").notNull(), // サンプルコンテンツ（JSON string）
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

/**
 * ユーザー独自テンプレートテーブル
 * ユーザーが作成・保存した独自のテンプレート
 */
export const userTemplates = mysqlTable("userTemplates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // テンプレートを作成したユーザー
  name: varchar("name", { length: 255 }).notNull(), // テンプレート名
  description: text("description").notNull(), // テンプレートの説明
  promptTemplate: text("promptTemplate").notNull(), // LLMに渡すプロンプトテンプレート
  isPublic: int("isPublic").notNull().default(0), // 公開設定（0: 非公開, 1: 公開）
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserTemplate = typeof userTemplates.$inferSelect;
export type InsertUserTemplate = typeof userTemplates.$inferInsert;

/**
 * お気に入りパターンテーブル
 * ユーザーが保存したお気に入りの生成パターン
 */
export const favoritePatterns = mysqlTable("favoritePatterns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // パターンを保存したユーザー
  name: varchar("name", { length: 255 }).notNull(), // パターン名（ユーザーが設定）
  resumeText: text("resumeText").notNull(), // 元の職務経歴書
  jobDescription: text("jobDescription").notNull(), // 元の求人情報
  generatedContent: text("generatedContent").notNull(), // 生成されたコンテンツ（JSON string）
  customItems: text("customItems"), // カスタム項目定義（JSON string）
  evaluationScore: int("evaluationScore"), // AI評価スコア（0-100）
  evaluationDetails: text("evaluationDetails"), // 評価詳細（JSON string）
  notes: text("notes"), // ユーザーのメモ
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FavoritePattern = typeof favoritePatterns.$inferSelect;
export type InsertFavoritePattern = typeof favoritePatterns.$inferInsert;

/**
 * 統計情報テーブル
 * 日別の訪問者数、利用回数、API使用状況を記録
 */
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD形式
  uniqueVisitors: int("uniqueVisitors").notNull().default(0), // ユニークユーザー数
  totalGenerations: int("totalGenerations").notNull().default(0), // 職務経歴書生成回数
  openaiUsage: int("openaiUsage").notNull().default(0), // OpenAI API使用回数
  geminiUsage: int("geminiUsage").notNull().default(0), // Gemini API使用回数
  claudeUsage: int("claudeUsage").notNull().default(0), // Claude API使用回数
  translationCount: int("translationCount").notNull().default(0), // 翻訳機能使用回数
  errorCount: int("errorCount").notNull().default(0), // エラー発生回数
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

/**
 * エラーログテーブル
 * システムエラー、APIエラー、ユーザーエラーを記録
 */
export const errorLogs = mysqlTable("errorLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // エラーが発生したユーザー（匿名の場合はnull）
  errorType: varchar("errorType", { length: 64 }).notNull(), // エラーの種類（api_error, validation_error, system_error）
  errorMessage: text("errorMessage").notNull(), // エラーメッセージ
  errorStack: text("errorStack"), // スタックトレース
  requestPath: varchar("requestPath", { length: 255 }), // リクエストパス
  userAgent: text("userAgent"), // ユーザーエージェント
  ipAddress: varchar("ipAddress", { length: 45 }), // IPアドレス
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ErrorLog = typeof errorLogs.$inferSelect;
export type InsertErrorLog = typeof errorLogs.$inferInsert;

/**
 * 通知テーブル
 * ユーザーへの通知を保存
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // 通知対象ユーザー（全体通知の場合はnull）
  type: mysqlEnum("type", ["success", "error", "warning", "info"]).notNull(), // 通知の種類
  title: varchar("title", { length: 255 }).notNull(), // 通知タイトル
  message: text("message").notNull(), // 通知メッセージ
  actionLabel: varchar("actionLabel", { length: 64 }), // アクションボタンのラベル
  actionUrl: varchar("actionUrl", { length: 255 }), // アクションボタンのURL
  isRead: int("isRead").notNull().default(0), // 既読フラグ（0: 未読, 1: 既読）
  expiresAt: timestamp("expiresAt"), // 通知の有効期限
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * 不正利用検知テーブル
 * 異常なアクセスパターンを記録
 */
export const abuseDetections = mysqlTable("abuseDetections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // 不正利用が疑われるユーザー
  ipAddress: varchar("ipAddress", { length: 45 }).notNull(), // IPアドレス
  detectionType: varchar("detectionType", { length: 64 }).notNull(), // 検知タイプ（rate_limit, suspicious_pattern）
  requestCount: int("requestCount").notNull(), // リクエスト回数
  timeWindow: int("timeWindow").notNull(), // 時間枠（秒）
  isBlocked: int("isBlocked").notNull().default(0), // ブロック済みフラグ（0: 未ブロック, 1: ブロック済み）
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AbuseDetection = typeof abuseDetections.$inferSelect;
export type InsertAbuseDetection = typeof abuseDetections.$inferInsert;
