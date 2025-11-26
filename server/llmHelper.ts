import { invokeLLM } from "./_core/llm";
import { invokeGemini, type GeminiMessage } from "./gemini";
import * as db from "./db";
import { decryptApiKey } from "./encryption";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * ユーザーの設定に応じてLLMを呼び出す統一ヘルパー関数
 */
export async function invokeLLMWithUserSettings(
  userId: number,
  messages: LLMMessage[]
): Promise<string> {
  // ユーザーのAPIキー設定を取得
  const apiKeyRecord = await db.getApiKey(userId);

  // APIキーが設定されていない場合は内蔵LLMを使用
  if (!apiKeyRecord || (!apiKeyRecord.encryptedOpenAIKey && !apiKeyRecord.encryptedGeminiKey)) {
    console.log("[LLM] Using built-in LLM");
    return await invokeBuiltInLLM(messages);
  }

  const primaryProvider = apiKeyRecord.primaryProvider || "gemini";

  // Geminiをメインプロバイダーとして使用
  if (primaryProvider === "gemini" && apiKeyRecord.encryptedGeminiKey) {
    try {
      console.log("[LLM] Using Gemini API");
      const apiKey = decryptApiKey(apiKeyRecord.encryptedGeminiKey);
      return await invokeGeminiAPI(apiKey, messages);
    } catch (error) {
      console.error("[LLM] Gemini API failed, falling back to built-in LLM:", error);
      return await invokeBuiltInLLM(messages);
    }
  }

  // OpenAIをメインプロバイダーとして使用
  if (primaryProvider === "openai" && apiKeyRecord.encryptedOpenAIKey) {
    try {
      console.log("[LLM] Using OpenAI API");
      const apiKey = decryptApiKey(apiKeyRecord.encryptedOpenAIKey);
      return await invokeOpenAIAPI(apiKey, messages);
    } catch (error) {
      console.error("[LLM] OpenAI API failed, falling back to built-in LLM:", error);
      return await invokeBuiltInLLM(messages);
    }
  }

  // フォールバック: 内蔵LLMを使用
  console.log("[LLM] Falling back to built-in LLM");
  return await invokeBuiltInLLM(messages);
}

/**
 * 内蔵LLMを呼び出す
 */
async function invokeBuiltInLLM(messages: LLMMessage[]): Promise<string> {
  const response = await invokeLLM({
    messages: messages.map((msg) => ({
      role: msg.role as "system" | "user" | "assistant",
      content: msg.content,
    })),
  });

  const content = response.choices[0]?.message?.content;
  if (typeof content === "string") {
    return content;
  }
  return "";
}

/**
 * Gemini APIを呼び出す
 */
async function invokeGeminiAPI(apiKey: string, messages: LLMMessage[]): Promise<string> {
  // Gemini APIは system role をサポートしていないため、systemメッセージをuserメッセージに変換
  const geminiMessages: GeminiMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg) continue;

    if (msg.role === "system") {
      // systemメッセージをuserメッセージとして扱う
      geminiMessages.push({
        role: "user",
        parts: msg.content,
      });
      // systemメッセージの後にダミーのmodelレスポンスを追加
      geminiMessages.push({
        role: "model",
        parts: "了解しました。指示に従います。",
      });
    } else if (msg.role === "user") {
      geminiMessages.push({
        role: "user",
        parts: msg.content,
      });
    } else if (msg.role === "assistant") {
      geminiMessages.push({
        role: "model",
        parts: msg.content,
      });
    }
  }

  return await invokeGemini(apiKey, geminiMessages);
}

/**
 * OpenAI APIを呼び出す
 */
async function invokeOpenAIAPI(apiKey: string, messages: LLMMessage[]): Promise<string> {
  // OpenAI APIを直接呼び出す
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content || "";
}
