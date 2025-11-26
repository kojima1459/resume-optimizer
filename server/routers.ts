import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { encryptApiKey, decryptApiKey } from "./encryption";
import { invokeGemini, type GeminiMessage } from "./gemini";
import { invokeLLMWithUserSettings } from "./llmHelper";

const STANDARD_ITEMS = [
  "summary",
  "career_history",
  "motivation",
  "self_pr",
  "why_company",
  "what_to_achieve",
] as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  resume: router({
    generateMultiple: protectedProcedure
      .input(
        z.object({
          resumeText: z.string().min(1, "職務経歴書を入力してください"),
          jobDescription: z.string().min(1, "求人情報を入力してください"),
          outputItems: z.array(z.string()),
          charLimits: z.record(z.string(), z.number()),
          customItems: z
            .array(
              z.object({
                key: z.string(),
                label: z.string(),
                charLimit: z.number().optional(),
              })
            )
            .optional(),
          patternCount: z.number().min(2).max(5).default(3),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { resumeText, jobDescription, outputItems, charLimits, customItems, patternCount } = input;

        const itemLabels: Record<string, string> = {
          summary: "職務要約",
          career_history: "職務経歴",
          motivation: "志望動機",
          self_pr: "自己PR",
          why_company: "なぜ御社か",
          what_to_achieve: "企業で実現したいこと",
        };

        if (customItems) {
          customItems.forEach((item) => {
            itemLabels[item.key] = item.label;
          });
        }

        const outputInstructions = outputItems
          .map((item) => {
            const label = itemLabels[item] || item;
            const limit = charLimits[item];
            return `- ${label}: ${limit ? `${limit}文字以内` : "適切な長さ"}`;
          })
          .join("\n");

        const patterns = [];

        for (let i = 0; i < patternCount; i++) {
          const styleInstructions = [
            "パターン1: 実績と数値を強調したロジカルな表現",
            "パターン2: 情熱と意欲を前面に出した表現",
            "パターン3: チームワークと協調性を強調した表現",
            "パターン4: リーダーシップと主導性を強調した表現",
            "パターン5: 専門性と技術力を強調した表現",
          ];

          const prompt = `あなたは職務経歴書最適化の専門家です。

【入力情報】
■職務経歴書
${resumeText}

■求人情報
${jobDescription}

【指示】
上記の職務経歴書を、求人情報に最適化してください。
以下の条件を厳守してください:

1. 嘘は絶対につかない
2. 既存の経歴・スキルの「見せ方」を最適化
3. 求人が求める人物像に合わせて強調点を変える
4. 具体的な数字・実績を活用

【スタイル指定】
${styleInstructions[i]}

【出力項目と文字数】
${outputInstructions}

【出力形式】
JSON形式で出力してください。キーは以下の通りです:
${outputItems.map((item) => `"${item}": "内容"`).join(", ")}`;

          const content = await invokeLLMWithUserSettings(ctx.user.id, [
            { role: "system", content: "あなたは職務経歴書最適化の専門家です。JSON形式で出力してください。" },
            { role: "user", content: prompt },
          ]);

          // JSONパース（マークダウンのコードブロックを削除）
          const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
          const jsonString = jsonMatch ? jsonMatch[1] : content;
          const result = JSON.parse(jsonString.trim());
          patterns.push(result);
        }

        return {
          patterns,
          patternCount,
        };
      }),

    generate: protectedProcedure
      .input(
        z.object({
          resumeText: z.string().min(1, "職務経歴書を入力してください"),
          jobDescription: z.string().min(1, "求人情報を入力してください"),
          outputItems: z.array(z.string()),
          charLimits: z.record(z.string(), z.number()),
          customItems: z
            .array(
              z.object({
                key: z.string(),
                label: z.string(),
                charLimit: z.number().optional(),
              })
            )
            .optional(),
          saveHistory: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { resumeText, jobDescription, outputItems, charLimits, customItems, saveHistory } = input;

        const itemLabels: Record<string, string> = {
          summary: "職務要約",
          career_history: "職務経歴",
          motivation: "志望動機",
          self_pr: "自己PR",
          why_company: "なぜ御社か",
          what_to_achieve: "企業で実現したいこと",
        };

        // Add custom item labels
        if (customItems) {
          customItems.forEach((item) => {
            itemLabels[item.key] = item.label;
          });
        }

        const outputInstructions = outputItems
          .map((item) => {
            const label = itemLabels[item] || item;
            const limit = charLimits[item];
            return `- ${label}: ${limit ? `${limit}文字以内` : "適切な長さ"}`;
          })
          .join("\n");

        const prompt = `あなたは職務経歴書最適化の専門家です。

【入力情報】
■職務経歴書
${resumeText}

■求人情報
${jobDescription}

【指示】
上記の職務経歴書を、求人情報に最適化してください。
以下の条件を厳守してください:

1. 嘘は絶対につかない
2. 既存の経歴・スキルの「見せ方」を最適化
3. 求人が求める人物像に合わせて強調点を変える
4. 具体的な数字・実績を活用

【出力項目と文字数】
${outputInstructions}

【出力形式】
JSON形式で出力してください。キーは以下の通りです:
${outputItems.map((item) => `"${item}"`).join(", ")}

例:
{
  "summary": "...",
  "motivation": "...",
  "self_pr": "...",
  "why_company": "..."
}`;

        const content = await invokeLLMWithUserSettings(ctx.user.id, [
          {
            role: "user",
            content: prompt,
          },
        ]);

        if (!content || typeof content !== "string") {
          throw new Error("生成に失敗しました");
        }

        // JSONパース（マークダウンのコードブロックを削除）
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        const result = JSON.parse(jsonString.trim());

        // Save to history if requested
        if (saveHistory && ctx.user) {
          await db.saveResume({
            userId: ctx.user.id,
            resumeText,
            jobDescription,
            generatedContent: JSON.stringify(result),
            customItems: customItems ? JSON.stringify(customItems) : null,
          });
        }

        return result;
      }),

    regenerate: protectedProcedure
      .input(
        z.object({
          item: z.string(),
          resumeText: z.string().min(1),
          jobDescription: z.string().min(1),
          charLimit: z.number().optional(),
          previousContent: z.string().optional(),
          itemLabel: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { item, resumeText, jobDescription, charLimit, previousContent, itemLabel } = input;

        const defaultLabels: Record<string, string> = {
          summary: "職務要約",
          career_history: "職務経歴",
          motivation: "志望動機",
          self_pr: "自己PR",
          why_company: "なぜ御社か",
          what_to_achieve: "企業で実現したいこと",
        };

        const label = itemLabel || defaultLabels[item] || item;

        const prompt = `あなたは職務経歴書最適化の専門家です。

【入力情報】
■職務経歴書
${resumeText}

■求人情報
${jobDescription}

${previousContent ? `■前回の生成内容\n${previousContent}\n` : ""}

【指示】
上記の情報を基に、「${label}」を${previousContent ? "別のパターンで" : ""}生成してください。
以下の条件を厳守してください:

1. 嘘は絶対につかない
2. 既存の経歴・スキルの「見せ方」を最適化
3. 求人が求める人物像に合わせて強調点を変える
4. 具体的な数字・実績を活用
${charLimit ? `5. ${charLimit}文字以内で記述` : ""}
${previousContent ? "6. 前回とは異なる表現や強調点を使用" : ""}

【出力形式】
JSON形式で出力してください:
{
  "content": "生成された${label}の内容"
}`;

        const content = await invokeLLMWithUserSettings(ctx.user.id, [
          {
            role: "user",
            content: prompt,
          },
        ]);

        if (!content || typeof content !== "string") {
          throw new Error("再生成に失敗しました");
        }

        // JSONパース（マークダウンのコードブロックを削除）
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        const result = JSON.parse(jsonString.trim());
        return { content: result.content };
      }),

    // History management
    history: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        const resumes = await db.getUserResumes(ctx.user.id);
        return resumes.map((resume) => ({
          id: resume.id,
          createdAt: resume.createdAt,
          resumeTextPreview: resume.resumeText.substring(0, 100) + "...",
          jobDescriptionPreview: resume.jobDescription.substring(0, 100) + "...",
        }));
      }),

      get: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          const resume = await db.getResumeById(input.id, ctx.user.id);
          if (!resume) {
            throw new Error("履歴が見つかりません");
          }
          return {
            id: resume.id,
            resumeText: resume.resumeText,
            jobDescription: resume.jobDescription,
            generatedContent: JSON.parse(resume.generatedContent),
            customItems: resume.customItems ? JSON.parse(resume.customItems) : null,
            createdAt: resume.createdAt,
          };
        }),

      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          const success = await db.deleteResume(input.id, ctx.user.id);
          if (!success) {
            throw new Error("履歴の削除に失敗しました");
          }
          return { success };
        }),
    }),

    translate: protectedProcedure
      .input(
        z.object({
          text: z.string().min(1),
          itemLabel: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { text, itemLabel } = input;

        const prompt = `以下の日本語の「${itemLabel}」を英語に翻訳してください。

原文:
${text}

条件:
1. ビジネス英語として自然で洗練された表現を使用
2. 職務経歴書で使われる専門用語を適切に使用
3. 原文のニュアンスを保ちながら翻訳

出力形式:
JSON形式で出力してください:
{
  "translation": "翻訳された英語テキスト"
}`;

        const content = await invokeLLMWithUserSettings(ctx.user.id, [
          {
            role: "user",
            content: prompt,
          },
        ]);

        if (!content || typeof content !== "string") {
          throw new Error("翻訳に失敗しました");
        }

        // JSONパース（マークダウンのコードブロックを削除）
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        const result = JSON.parse(jsonString.trim());
        return { translation: result.translation };
      }),
  }),

  // テンプレート用のrouter
  template: router({
    // 全テンプレートを取得
    list: publicProcedure.query(async () => {
      const templates = await db.getAllTemplates();
      return templates.map((template) => ({
        id: template.id,
        category: template.category,
        jobType: template.jobType,
        name: template.name,
        description: template.description,
      }));
    }),

    // カテゴリ別にテンプレートを取得
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        const templates = await db.getTemplatesByCategory(input.category);
        return templates.map((template) => ({
          id: template.id,
          category: template.category,
          jobType: template.jobType,
          name: template.name,
          description: template.description,
        }));
      }),

    // テンプレートの詳細を取得
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const template = await db.getTemplateById(input.id);
        if (!template) {
          throw new Error("テンプレートが見つかりません");
        }
        return template;
      }),

    // テンプレートを使用して生成
    generateWithTemplate: protectedProcedure
      .input(
        z.object({
          templateId: z.number(),
          resumeText: z.string().min(1, "職務経歴書を入力してください"),
          jobDescription: z.string().min(1, "求人情報を入力してください"),
          outputItems: z.array(z.string()),
          charLimits: z.record(z.string(), z.number()),
          customItems: z
            .array(
              z.object({
                key: z.string(),
                label: z.string(),
                charLimit: z.number().optional(),
              })
            )
            .optional(),
          saveHistory: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { templateId, resumeText, jobDescription, outputItems, charLimits, customItems, saveHistory } = input;

        // テンプレートを取得
        const template = await db.getTemplateById(templateId);
        if (!template) {
          throw new Error("テンプレートが見つかりません");
        }

        const itemLabels: Record<string, string> = {
          summary: "職務要約",
          career_history: "職務経歴",
          motivation: "志望動機",
          self_pr: "自己PR",
          why_company: "なぜ御社か",
          what_to_achieve: "企業で実現したいこと",
        };

        if (customItems) {
          customItems.forEach((item) => {
            itemLabels[item.key] = item.label;
          });
        }

        const outputInstructions = outputItems
          .map((item) => {
            const label = itemLabels[item] || item;
            const limit = charLimits[item];
            return `- ${label}: ${limit ? `${limit}文字以内` : "適切な長さ"}`;
          })
          .join("\n");

        // テンプレートのプロンプトに変数を埋め込む
        const prompt = template.promptTemplate
          .replace(/\{\{resumeText\}\}/g, resumeText)
          .replace(/\{\{jobDescription\}\}/g, jobDescription) +
          `\n\n【出力項目と文字数】\n${outputInstructions}\n\n【出力形式】\nJSON形式で出力してください。キーは以下の通りです:\n${outputItems.map((item) => `"${item}"`).join(", ")}\n\n例:\n{\n  "summary": "...",\n  "motivation": "...",\n  "self_pr": "...",\n  "why_company": "..."\n}`;

        const content = await invokeLLMWithUserSettings(ctx.user.id, [
          {
            role: "user",
            content: prompt,
          },
        ]);

        if (!content || typeof content !== "string") {
          throw new Error("生成に失敗しました");
        }

        // JSONパース（マークダウンのコードブロックを削除）
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;
        const result = JSON.parse(jsonString.trim());

        // Save to history if requested
        if (saveHistory && ctx.user) {
          await db.saveResume({
            userId: ctx.user.id,
            resumeText,
            jobDescription,
            generatedContent: JSON.stringify(result),
            customItems: customItems ? JSON.stringify(customItems) : null,
          });
        }

        return result;
      }),
  }),

  // APIキー設定用のrouter
  apiKey: router({
    // APIキーを取得（復号化して返す）
    get: protectedProcedure.query(async ({ ctx }) => {
      const apiKeyRecord = await db.getApiKey(ctx.user.id);
      if (!apiKeyRecord) {
        return { hasOpenAIKey: false, hasGeminiKey: false, primaryProvider: null };
      }

      try {
        let maskedOpenAIKey = null;
        let maskedGeminiKey = null;

        if (apiKeyRecord.encryptedOpenAIKey) {
          const decryptedKey = decryptApiKey(apiKeyRecord.encryptedOpenAIKey);
          maskedOpenAIKey =
            decryptedKey.length > 8
              ? `${decryptedKey.slice(0, 4)}...${decryptedKey.slice(-4)}`
              : "****";
        }

        if (apiKeyRecord.encryptedGeminiKey) {
          const decryptedKey = decryptApiKey(apiKeyRecord.encryptedGeminiKey);
          maskedGeminiKey =
            decryptedKey.length > 8
              ? `${decryptedKey.slice(0, 4)}...${decryptedKey.slice(-4)}`
              : "****";
        }

        return {
          hasOpenAIKey: !!apiKeyRecord.encryptedOpenAIKey,
          hasGeminiKey: !!apiKeyRecord.encryptedGeminiKey,
          primaryProvider: apiKeyRecord.primaryProvider,
          maskedOpenAIKey,
          maskedGeminiKey,
        };
      } catch (error) {
        console.error("[APIKey] Failed to decrypt API key:", error);
        return { hasOpenAIKey: false, hasGeminiKey: false, primaryProvider: null };
      }
    }),

    // APIキーを保存（暗号化して保存）
    save: protectedProcedure
      .input(
        z.object({
          openAIKey: z.string().optional(),
          geminiKey: z.string().optional(),
          primaryProvider: z.string().default("gemini"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const encryptedOpenAIKey = input.openAIKey ? encryptApiKey(input.openAIKey) : null;
          const encryptedGeminiKey = input.geminiKey ? encryptApiKey(input.geminiKey) : null;
          const success = await db.upsertApiKey(
            ctx.user.id,
            encryptedOpenAIKey,
            encryptedGeminiKey,
            input.primaryProvider
          );
          return { success };
        } catch (error) {
          console.error("[APIKey] Failed to save API key:", error);
          throw new Error("APIキーの保存に失敗しました");
        }
      }),

    // APIキーを削除
    delete: protectedProcedure.mutation(async ({ ctx }) => {
      const success = await db.deleteApiKey(ctx.user.id);
      return { success };
    }),
  }),
});

export type AppRouter = typeof appRouter;
