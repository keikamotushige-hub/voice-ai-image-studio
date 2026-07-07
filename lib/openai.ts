import OpenAI, { toFile } from "openai";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY が設定されていません。.env.local を確認してください。"
    );
  }

  if (!client) {
    client = new OpenAI({ apiKey });
  }

  return client;
}

export async function bufferToPngFile(
  buffer: Buffer,
  filename: string
): Promise<File> {
  return toFile(buffer, filename, { type: "image/png" });
}
