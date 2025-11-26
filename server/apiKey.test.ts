import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { encryptApiKey, decryptApiKey } from "./encryption";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("apiKey router", () => {
  it("should save and retrieve OpenAI API key", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Save OpenAI API key
    const saveResult = await caller.apiKey.save({
      openAIKey: "sk-test1234567890",
      primaryProvider: "openai",
    });

    expect(saveResult.success).toBe(true);

    // Get API key
    const getResult = await caller.apiKey.get();

    expect(getResult.hasOpenAIKey).toBe(true);
    expect(getResult.hasGeminiKey).toBe(false);
    expect(getResult.primaryProvider).toBe("openai");
    expect(getResult.maskedOpenAIKey).toContain("sk-t");
    expect(getResult.maskedOpenAIKey).toContain("...");
  });

  it("should save and retrieve Gemini API key", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Save Gemini API key
    const saveResult = await caller.apiKey.save({
      geminiKey: "AIza-test1234567890",
      primaryProvider: "gemini",
    });

    expect(saveResult.success).toBe(true);

    // Get API key
    const getResult = await caller.apiKey.get();

    expect(getResult.hasOpenAIKey).toBe(false);
    expect(getResult.hasGeminiKey).toBe(true);
    expect(getResult.primaryProvider).toBe("gemini");
    expect(getResult.maskedGeminiKey).toContain("AIza");
    expect(getResult.maskedGeminiKey).toContain("...");
  });

  it("should save both OpenAI and Gemini API keys", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Save both API keys
    const saveResult = await caller.apiKey.save({
      openAIKey: "sk-test1234567890",
      geminiKey: "AIza-test1234567890",
      primaryProvider: "openai",
    });

    expect(saveResult.success).toBe(true);

    // Get API keys
    const getResult = await caller.apiKey.get();

    expect(getResult.hasOpenAIKey).toBe(true);
    expect(getResult.hasGeminiKey).toBe(true);
    expect(getResult.primaryProvider).toBe("openai");
    expect(getResult.maskedOpenAIKey).toContain("sk-t");
    expect(getResult.maskedGeminiKey).toContain("AIza");
  });

  it("should delete API key", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Save API key first
    await caller.apiKey.save({
      openAIKey: "sk-test1234567890",
      primaryProvider: "openai",
    });

    // Delete API key
    const deleteResult = await caller.apiKey.delete();
    expect(deleteResult.success).toBe(true);

    // Verify deletion
    const getResult = await caller.apiKey.get();
    expect(getResult.hasOpenAIKey).toBe(false);
    expect(getResult.hasGeminiKey).toBe(false);
  });
});

describe("encryption", () => {
  it("should encrypt and decrypt API key correctly", () => {
    const originalKey = "sk-test1234567890abcdef";
    const encrypted = encryptApiKey(originalKey);
    const decrypted = decryptApiKey(encrypted);

    expect(decrypted).toBe(originalKey);
    expect(encrypted).not.toBe(originalKey);
  });

  it("should produce different ciphertext for the same plaintext", () => {
    const originalKey = "sk-test1234567890";
    const encrypted1 = encryptApiKey(originalKey);
    const encrypted2 = encryptApiKey(originalKey);

    // Different ciphertext due to random salt and IV
    expect(encrypted1).not.toBe(encrypted2);

    // But both decrypt to the same plaintext
    expect(decryptApiKey(encrypted1)).toBe(originalKey);
    expect(decryptApiKey(encrypted2)).toBe(originalKey);
  });
});
