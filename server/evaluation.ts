import { invokeLLM } from "./_core/llm";

export interface EvaluationResult {
  score: number; // 0-100
  details: {
    relevance: number; // 求人との関連性 (0-100)
    clarity: number; // 明確性・読みやすさ (0-100)
    impact: number; // インパクト・説得力 (0-100)
    completeness: number; // 完全性 (0-100)
    feedback: string; // 改善提案
  };
}

/**
 * 生成された職務経歴書を求人情報に基づいて評価する
 */
export async function evaluateResume(
  resumeContent: string,
  jobDescription: string
): Promise<EvaluationResult> {
  const prompt = `あなたは採用担当者の視点で職務経歴書を評価するAIアシスタントです。

以下の求人情報と職務経歴書を比較し、以下の基準で評価してください：

1. **求人との関連性 (relevance)**: 求人要件と経歴の一致度
2. **明確性・読みやすさ (clarity)**: 文章の明確さと構成
3. **インパクト・説得力 (impact)**: 実績の具体性と説得力
4. **完全性 (completeness)**: 必要な情報の網羅性

各項目を0-100点で評価し、総合スコアも算出してください。
また、改善提案も簡潔に記載してください。

【求人情報】
${jobDescription}

【職務経歴書】
${resumeContent}

以下のJSON形式で回答してください：
{
  "relevance": <0-100の数値>,
  "clarity": <0-100の数値>,
  "impact": <0-100の数値>,
  "completeness": <0-100の数値>,
  "feedback": "<改善提案>"
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a professional resume evaluator. Always respond in valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "resume_evaluation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              relevance: {
                type: "integer",
                description: "求人との関連性スコア (0-100)",
              },
              clarity: {
                type: "integer",
                description: "明確性・読みやすさスコア (0-100)",
              },
              impact: {
                type: "integer",
                description: "インパクト・説得力スコア (0-100)",
              },
              completeness: {
                type: "integer",
                description: "完全性スコア (0-100)",
              },
              feedback: {
                type: "string",
                description: "改善提案",
              },
            },
            required: ["relevance", "clarity", "impact", "completeness", "feedback"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error("評価結果の取得に失敗しました");
    }

    const details = JSON.parse(content);
    
    // 総合スコアを計算（各項目の平均）
    const score = Math.round(
      (details.relevance + details.clarity + details.impact + details.completeness) / 4
    );

    return {
      score,
      details,
    };
  } catch (error) {
    console.error("Resume evaluation failed:", error);
    throw new Error("職務経歴書の評価に失敗しました");
  }
}

/**
 * 複数の職務経歴書を並列で評価する
 */
export async function evaluateResumesInParallel(
  resumes: Array<{ id: number; content: string }>,
  jobDescription: string
): Promise<Array<{ id: number; evaluation: EvaluationResult }>> {
  try {
    // Promise.allを使用して並列実行
    const evaluationPromises = resumes.map(async (resume) => {
      const evaluation = await evaluateResume(resume.content, jobDescription);
      return {
        id: resume.id,
        evaluation,
      };
    });

    const results = await Promise.all(evaluationPromises);
    return results;
  } catch (error) {
    console.error("Parallel resume evaluation failed:", error);
    throw new Error("複数の職務経歴書の評価に失敗しました");
  }
}
