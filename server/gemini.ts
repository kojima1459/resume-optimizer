import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeminiMessage {
  role: "user" | "model";
  parts: string;
}

export async function invokeGemini(apiKey: string, messages: GeminiMessage[]): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Gemini APIは会話履歴形式をサポート
  const chat = model.startChat({
    history: messages.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    })),
  });

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    throw new Error("No messages provided");
  }

  const result = await chat.sendMessage(lastMessage.parts);
  const response = result.response;
  return response.text();
}
