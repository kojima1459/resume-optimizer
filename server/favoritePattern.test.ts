import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
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

describe("favoritePattern", () => {
  it("creates a favorite pattern successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favoritePattern.create({
      name: "Test Pattern",
      resumeText: "Sample resume text",
      jobDescription: "Sample job description",
      generatedContent: {
        summary: "Test summary",
        motivation: "Test motivation",
      },
      evaluationScore: 85,
      evaluationDetails: {
        relevance: 90,
        clarity: 85,
        impact: 80,
        completeness: 85,
        feedback: "Good pattern",
      },
    });

    expect(result.success).toBe(true);
  });

  it("lists favorite patterns for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a pattern first
    await caller.favoritePattern.create({
      name: "Test Pattern for List",
      resumeText: "Sample resume",
      jobDescription: "Sample job",
      generatedContent: {
        summary: "Summary",
      },
    });

    const patterns = await caller.favoritePattern.list();
    expect(Array.isArray(patterns)).toBe(true);
    expect(patterns.length).toBeGreaterThan(0);
  });

  it("gets a specific favorite pattern by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a pattern
    await caller.favoritePattern.create({
      name: "Test Pattern for Get",
      resumeText: "Resume",
      jobDescription: "Job",
      generatedContent: {
        summary: "Summary",
      },
    });

    // Get all patterns to find the ID
    const patterns = await caller.favoritePattern.list();
    const pattern = patterns.find(p => p.name === "Test Pattern for Get");

    expect(pattern).toBeDefined();
    if (pattern) {
      const retrieved = await caller.favoritePattern.get({ id: pattern.id });
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe("Test Pattern for Get");
    }
  });

  it("updates a favorite pattern successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a pattern
    await caller.favoritePattern.create({
      name: "Original Name",
      resumeText: "Resume",
      jobDescription: "Job",
      generatedContent: {
        summary: "Summary",
      },
    });

    // Get the pattern ID
    const patterns = await caller.favoritePattern.list();
    const patternId = patterns[patterns.length - 1]?.id;

    if (patternId) {
      const result = await caller.favoritePattern.update({
        id: patternId,
        name: "Updated Name",
        notes: "Updated notes",
      });

      expect(result.success).toBe(true);

      // Verify the update
      const updated = await caller.favoritePattern.get({ id: patternId });
      expect(updated.name).toBe("Updated Name");
      expect(updated.notes).toBe("Updated notes");
    }
  });

  it("deletes a favorite pattern successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a pattern
    await caller.favoritePattern.create({
      name: "Pattern to Delete",
      resumeText: "Resume",
      jobDescription: "Job",
      generatedContent: {
        summary: "Summary",
      },
    });

    // Get the pattern ID
    const patterns = await caller.favoritePattern.list();
    const initialCount = patterns.length;
    const patternId = patterns[patterns.length - 1]?.id;

    if (patternId) {
      const result = await caller.favoritePattern.delete({ id: patternId });
      expect(result.success).toBe(true);

      // Verify deletion
      const afterDelete = await caller.favoritePattern.list();
      expect(afterDelete.length).toBe(initialCount - 1);
    }
  });
});
