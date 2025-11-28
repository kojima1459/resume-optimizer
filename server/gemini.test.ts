import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Gemini API Integration", () => {
  it("should save Gemini API key to database", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Gemini API キーを保存
    const result = await caller.apiKey.save({
      geminiKey: "test-gemini-key-12345",
      primaryProvider: "gemini",
    });

    expect(result.success).toBe(true);
  });

  it("should retrieve saved Gemini API key", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Gemini API キーを保存
    await caller.apiKey.save({
      geminiKey: "test-gemini-key-12345",
      primaryProvider: "gemini",
    });

    // 保存されたキーを取得
    const result = await caller.apiKey.get();

    expect(result.hasGeminiKey).toBe(true);
    expect(result.primaryProvider).toBe("gemini");
    expect(result.maskedGeminiKey).toBe("test...2345");
  });

  it("should handle API key encryption and decryption", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const testKey = "AIzaSyC0en9Yjd0ieDL7oTHGgPAYHygfMl86HF4";

    // API キーを保存
    await caller.apiKey.save({
      geminiKey: testKey,
      primaryProvider: "gemini",
    });

    // 保存されたキーを取得（マスク済み）
    const result = await caller.apiKey.get();

    expect(result.hasGeminiKey).toBe(true);
    expect(result.maskedGeminiKey).not.toBe(testKey);
    expect(result.maskedGeminiKey).toContain("...");
  });

  it("should support multiple providers", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // OpenAI と Gemini の両方を保存
    const result = await caller.apiKey.save({
      openAIKey: "sk-test-openai-key",
      geminiKey: "AIzaSyC0en9Yjd0ieDL7oTHGgPAYHygfMl86HF4",
      primaryProvider: "gemini",
    });

    expect(result.success).toBe(true);

    // 両方が保存されたか確認
    const getResult = await caller.apiKey.get();

    expect(getResult.hasOpenAIKey).toBe(true);
    expect(getResult.hasGeminiKey).toBe(true);
    expect(getResult.primaryProvider).toBe("gemini");
  });

  it("should delete API keys", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // API キーを保存
    await caller.apiKey.save({
      geminiKey: "test-gemini-key",
      primaryProvider: "gemini",
    });

    // API キーを削除
    const deleteResult = await caller.apiKey.delete();
    expect(deleteResult.success).toBe(true);

    // 削除されたか確認
    const getResult = await caller.apiKey.get();
    expect(getResult.hasGeminiKey).toBe(false);
    expect(getResult.hasOpenAIKey).toBe(false);
  });
});
