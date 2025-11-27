import { describe, expect, it } from "vitest";
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("resume.generateMultiple", () => {
  it(
    "generates multiple patterns with different styles",
    async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resume.generateMultiple({
      resumeText: "ソフトウェアエンジニアとして5年の経験があります。",
      jobDescription: "Webアプリケーション開発エンジニアを募集しています。",
      outputItems: ["summary", "motivation"],
      charLimits: {
        summary: 200,
        motivation: 300,
      },
      patternCount: 3,
    });

    expect(result).toHaveProperty("patterns");
    expect(result).toHaveProperty("patternCount");
    expect(result.patternCount).toBe(3);
    expect(result.patterns).toHaveLength(3);
    
    // 各パターンが必要な項目を含んでいることを確認
    result.patterns.forEach((item) => {
      expect(item).toHaveProperty("pattern");
      expect(item).toHaveProperty("evaluation");
      expect(item.pattern).toHaveProperty("summary");
      expect(item.pattern).toHaveProperty("motivation");
      expect(typeof item.pattern.summary).toBe("string");
      expect(typeof item.pattern.motivation).toBe("string");
      expect(item.pattern.summary.length).toBeGreaterThan(0);
      expect(item.pattern.motivation.length).toBeGreaterThan(0);
    });

    // 各パターンが異なる内容であることを確認
    const summaries = result.patterns.map((item) => item.pattern.summary);
    const uniqueSummaries = new Set(summaries);
    expect(uniqueSummaries.size).toBeGreaterThan(1);
    },
    60000
  );

  it(
    "respects custom pattern count",
    async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resume.generateMultiple({
      resumeText: "マーケティング担当として3年の経験があります。",
      jobDescription: "デジタルマーケティング担当者を募集しています。",
      outputItems: ["self_pr"],
      charLimits: {
        self_pr: 400,
      },
      patternCount: 2,
    });

    expect(result.patternCount).toBe(2);
    expect(result.patterns).toHaveLength(2);
    },
    20000
  );

  it(
    "handles custom items correctly",
    async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resume.generateMultiple({
      resumeText: "プロジェクトマネージャーとして10年の経験があります。",
      jobDescription: "シニアプロジェクトマネージャーを募集しています。",
      outputItems: ["summary", "custom_why_now"],
      charLimits: {
        summary: 300,
        custom_why_now: 400,
      },
      customItems: [
        {
          key: "custom_why_now",
          label: "なぜ今転職するのか",
          charLimit: 400,
        },
      ],
      patternCount: 3,
    });

    expect(result.patterns).toHaveLength(3);
    result.patterns.forEach((item) => {
      expect(item).toHaveProperty("pattern");
      expect(item).toHaveProperty("evaluation");
      expect(item.pattern).toHaveProperty("summary");
      expect(item.pattern).toHaveProperty("custom_why_now");
      expect(typeof item.pattern.custom_why_now).toBe("string");
      expect(item.pattern.custom_why_now.length).toBeGreaterThan(0);
    });
    },
    60000
  );
});
