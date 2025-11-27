import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import type { InsertFavoritePattern } from "../drizzle/schema";
import { encryptApiKey, decryptApiKey } from "./encryption";
import { invokeGemini, type GeminiMessage } from "./gemini";
import { invokeLLMWithUserSettings } from "./llmHelper";
import { evaluateResume } from "./evaluation";

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

      toggleFavorite: protectedProcedure
        .input(z.object({ id: z.number(), isFavorite: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
          const success = await db.toggleFavorite(input.id, ctx.user.id, input.isFavorite);
          if (!success) {
            throw new Error("お気に入りの更新に失敗しました");
          }
          return { success, isFavorite: input.isFavorite };
        }),

      listFavorites: protectedProcedure.query(async ({ ctx }) => {
        const favorites = await db.getFavoriteResumes(ctx.user.id);
        return favorites.map((resume) => ({
          id: resume.id,
          createdAt: resume.createdAt,
          resumeTextPreview: resume.resumeText.substring(0, 100) + "...",
          jobDescriptionPreview: resume.jobDescription.substring(0, 100) + "...",
          isFavorite: resume.isFavorite,
        }));
      }),
    }),

    // 評価機能
    evaluate: protectedProcedure
      .input(
        z.object({
          resumeContent: z.string().min(1),
          jobDescription: z.string().min(1),
          resumeId: z.number().optional(), // 履歴ID（保存する場合）
        })
      )
      .mutation(async ({ input, ctx }) => {
        const evaluation = await evaluateResume(input.resumeContent, input.jobDescription);

        // 履歴IDが指定されていれば、評価結果を保存
        if (input.resumeId) {
          await db.updateResumeEvaluation(
            input.resumeId,
            ctx.user.id,
            evaluation.score,
            JSON.stringify(evaluation.details)
          );
        }

        return evaluation;
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

    convertToEnglish: protectedProcedure
      .input(
        z.object({
          content: z.record(z.string(), z.string()),
          targetWordCount: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { content, targetWordCount } = input;

        const prompt = `以下の日本語の職務経歴書を英語に変換してください。

原文:
${Object.entries(content)
  .map(([key, value]) => `${key}:\n${value}`)
  .join("\n\n")}

条件:
1. 英語圈の履歴書フォーマットに最適化
2. ビジネス英語として自然で洗練された表現を使用
3. 職務経歴書で使われる専門用語を適切に使用
4. 原文のニュアンスを保ちながら翻訳
5. 動詞を使って成果を強調（例: "Achieved", "Developed", "Led"）${targetWordCount ? `\n6. 合計単語数を約${targetWordCount}単語に調整` : ""}

出力形式:
JSON形式で出力してください。各項目を英語に変換して返してください。
{
  "項目名1": "英語に変換されたテキスト",
  "項目名2": "英語に変換されたテキスト",
  ...
}`;

        const llmContent = await invokeLLMWithUserSettings(ctx.user.id, [
          {
            role: "user",
            content: prompt,
          },
        ]);

        if (!llmContent || typeof llmContent !== "string") {
          throw new Error("英語変換に失敗しました");
        }

        // JSONパース（マークダウンのコードブロックを削除）
        const jsonMatch = llmContent.match(/```json\n([\s\S]*?)\n```/) || llmContent.match(/```\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : llmContent;
        const result = JSON.parse(jsonString.trim());

        return { englishContent: result };
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

  // ユーザーテンプレート用のrouter
  userTemplate: router({
    // ユーザーのテンプレート一覧を取得
    list: protectedProcedure.query(async ({ ctx }) => {
      const templates = await db.getUserTemplates(ctx.user.id);
      return templates;
    }),

    // テンプレートの詳細を取得
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const template = await db.getUserTemplateById(input.id, ctx.user.id);
        if (!template) {
          throw new Error("テンプレートが見つかりません");
        }
        return template;
      }),

    // テンプレートを作成
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "テンプレート名を入力してください"),
          description: z.string().min(1, "説明を入力してください"),
          promptTemplate: z.string().min(1, "プロンプトテンプレートを入力してください"),
          isPublic: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const templateId = await db.createUserTemplate({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          promptTemplate: input.promptTemplate,
          isPublic: input.isPublic ? 1 : 0,
        });
        return { id: templateId };
      }),

    // テンプレートを更新
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          description: z.string().min(1).optional(),
          promptTemplate: z.string().min(1).optional(),
          isPublic: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...updates } = input;
        const updateData: any = {};
        if (updates.name) updateData.name = updates.name;
        if (updates.description) updateData.description = updates.description;
        if (updates.promptTemplate) updateData.promptTemplate = updates.promptTemplate;
        if (updates.isPublic !== undefined) updateData.isPublic = updates.isPublic ? 1 : 0;

        const success = await db.updateUserTemplate(id, ctx.user.id, updateData);
        if (!success) {
          throw new Error("テンプレートの更新に失敗しました");
        }
        return { success };
      }),

    // テンプレートを削除
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const success = await db.deleteUserTemplate(input.id, ctx.user.id);
        if (!success) {
          throw new Error("テンプレートの削除に失敗しました");
        }
        return { success };
      }),

    // ユーザーテンプレートを使用して生成
    generateWithUserTemplate: protectedProcedure
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

        // ユーザーテンプレートを取得
        const template = await db.getUserTemplateById(templateId, ctx.user.id);
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

  // お気に入りパターン用のrouter
  favoritePattern: router({
    // お気に入りパターンを作成
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "パターン名を入力してください"),
          resumeText: z.string().min(1),
          jobDescription: z.string().min(1),
          generatedContent: z.record(z.string(), z.string()),
          customItems: z
            .array(
              z.object({
                key: z.string(),
                label: z.string(),
                charLimit: z.number().optional(),
              })
            )
            .optional(),
          evaluationScore: z.number().optional(),
          evaluationDetails: z.any().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { name, resumeText, jobDescription, generatedContent, customItems, evaluationScore, evaluationDetails, notes } = input;

        await db.createFavoritePattern({
          userId: ctx.user.id,
          name,
          resumeText,
          jobDescription,
          generatedContent: JSON.stringify(generatedContent),
          customItems: customItems ? JSON.stringify(customItems) : null,
          evaluationScore: evaluationScore || null,
          evaluationDetails: evaluationDetails ? JSON.stringify(evaluationDetails) : null,
          notes: notes || null,
        });

        return { success: true };
      }),

    // お気に入りパターン一覧を取得
    list: protectedProcedure.query(async ({ ctx }) => {
      const patterns = await db.listFavoritePatterns(ctx.user.id);
      return patterns.map((pattern: any) => ({
        id: pattern.id,
        name: pattern.name,
        evaluationScore: pattern.evaluationScore,
        notes: pattern.notes,
        generatedContent: pattern.generatedContent,
        createdAt: pattern.createdAt,
        updatedAt: pattern.updatedAt,
      }));
    }),

    // お気に入りパターンの詳細を取得
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const pattern = await db.getFavoritePatternById(input.id);
        if (!pattern || pattern.userId !== ctx.user.id) {
          throw new Error("お気に入りパターンが見つかりません");
        }

        return {
          id: pattern.id,
          name: pattern.name,
          resumeText: pattern.resumeText,
          jobDescription: pattern.jobDescription,
          generatedContent: pattern.generatedContent,
          customItems: pattern.customItems,
          evaluationScore: pattern.evaluationScore,
          evaluationDetails: pattern.evaluationDetails,
          notes: pattern.notes,
          createdAt: pattern.createdAt,
          updatedAt: pattern.updatedAt,
        };
      }),

    // お気に入りパターンを更新
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          notes: z.string().optional(),
          generatedContent: z.record(z.string(), z.string()).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, name, notes, generatedContent } = input;

        // 権限チェック
        const pattern = await db.getFavoritePatternById(id);
        if (!pattern || pattern.userId !== ctx.user.id) {
          throw new Error("お気に入りパターンが見つかりません");
        }

        const updateData: Partial<InsertFavoritePattern> = {};
        if (name !== undefined) updateData.name = name;
        if (notes !== undefined) updateData.notes = notes;
        if (generatedContent !== undefined) updateData.generatedContent = JSON.stringify(generatedContent);

        await db.updateFavoritePattern(id, updateData);
        return { success: true };
      }),

    // お気に入りパターンを削除
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // 権限チェック
        const pattern = await db.getFavoritePatternById(input.id);
        if (!pattern || pattern.userId !== ctx.user.id) {
          throw new Error("お気に入りパターンが見つかりません");
        }

        await db.deleteFavoritePattern(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
