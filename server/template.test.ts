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

describe("template.list", () => {
  it("should return a list of templates", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.template.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    if (result.length > 0) {
      const template = result[0];
      expect(template).toHaveProperty("id");
      expect(template).toHaveProperty("category");
      expect(template).toHaveProperty("jobType");
      expect(template).toHaveProperty("name");
      expect(template).toHaveProperty("description");
    }
  });
});

describe("template.getByCategory", () => {
  it("should return templates for a specific category", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.template.getByCategory({ category: "IT" });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    result.forEach((template) => {
      expect(template.category).toBe("IT");
    });
  });
});

describe("template.getById", () => {
  it("should return a template by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First get the list of templates to get a valid ID
    const templates = await caller.template.list();
    
    if (templates.length > 0) {
      const templateId = templates[0]!.id;
      const result = await caller.template.getById({ id: templateId });

      expect(result).toBeDefined();
      expect(result.id).toBe(templateId);
      expect(result).toHaveProperty("promptTemplate");
      expect(result).toHaveProperty("sampleContent");
    }
  });

  it("should throw an error for non-existent template", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.template.getById({ id: 999999 })
    ).rejects.toThrow("テンプレートが見つかりません");
  });
});

describe("template.generateWithTemplate", () => {
  it("should generate content using a template", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First get a template
    const templates = await caller.template.list();
    
    if (templates.length > 0) {
      const templateId = templates[0]!.id;
      
      const result = await caller.template.generateWithTemplate({
        templateId,
        resumeText: "5年間のWebエンジニア経験。React、Node.jsを使用した開発経験あり。",
        jobDescription: "フロントエンドエンジニア募集。React経験者優遇。",
        outputItems: ["summary", "motivation"],
        charLimits: { summary: 300, motivation: 400 },
        saveHistory: false,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty("summary");
      expect(result).toHaveProperty("motivation");
      expect(typeof result.summary).toBe("string");
      expect(typeof result.motivation).toBe("string");
    }
  }, 30000); // Increase timeout for LLM call
});
