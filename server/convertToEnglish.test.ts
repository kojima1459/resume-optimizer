import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
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

// LLM呼び出しをモック化
vi.mock("./llmHelper", () => ({
  invokeLLMWithUserSettings: vi.fn(async () => {
    return JSON.stringify({
      summary: "Experienced software engineer with 5+ years of expertise in web development",
      motivation: "Passionate about creating innovative solutions that drive business growth",
    });
  }),
}));

describe("resume.convertToEnglish", () => {
  it("日本語の職務経歴書を英語に変換できる", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resume.convertToEnglish({
      content: {
        summary: "5年以上のWeb開発経験を持つソフトウェアエンジニア",
        motivation: "ビジネスの成長を促進する革新的なソリューションの創造に情熱を持っています",
      },
    });

    expect(result).toHaveProperty("englishContent");
    expect(result.englishContent).toHaveProperty("summary");
    expect(result.englishContent).toHaveProperty("motivation");
  });

  it("目標単語数を指定して変換できる", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resume.convertToEnglish({
      content: {
        summary: "5年以上のWeb開発経験を持つソフトウェアエンジニア",
      },
      targetWordCount: 300,
    });

    expect(result).toHaveProperty("englishContent");
    expect(result.englishContent).toHaveProperty("summary");
  });
});
