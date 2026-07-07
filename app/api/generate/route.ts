import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { validatePrompt } from "@/lib/content-policy";
import type { ApiResponse, GenerateResponseData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const VALID_SIZES = ["1024x1024", "1792x1024", "1024x1792"] as const;
const VALID_QUALITIES = ["standard", "hd"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size = "1024x1024", quality = "standard" } = body as {
      prompt?: string;
      size?: string;
      quality?: string;
    };

    if (!prompt?.trim()) {
      return NextResponse.json<ApiResponse<GenerateResponseData>>(
        {
          success: false,
          error: "プロンプトを入力してください。",
        },
        { status: 400 }
      );
    }

    const policyError = validatePrompt(prompt);
    if (policyError) {
      return NextResponse.json<ApiResponse<GenerateResponseData>>(
        { success: false, error: policyError },
        { status: 403 }
      );
    }

    if (!VALID_SIZES.includes(size as (typeof VALID_SIZES)[number])) {
      return NextResponse.json<ApiResponse<GenerateResponseData>>(
        {
          success: false,
          error: "無効な画像サイズが指定されました。",
        },
        { status: 400 }
      );
    }

    if (!VALID_QUALITIES.includes(quality as (typeof VALID_QUALITIES)[number])) {
      return NextResponse.json<ApiResponse<GenerateResponseData>>(
        {
          success: false,
          error: "無効な品質設定が指定されました。",
        },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt.trim(),
      n: 1,
      size: size as "1024x1024" | "1792x1024" | "1024x1792",
      quality: quality as "standard" | "hd",
      response_format: "b64_json",
    });

    const result = response.data?.[0];
    const b64 = result?.b64_json;

    if (!b64) {
      return NextResponse.json<ApiResponse<GenerateResponseData>>(
        {
          success: false,
          error: "画像の生成結果を取得できませんでした。",
        },
        { status: 502 }
      );
    }

    return NextResponse.json<ApiResponse<GenerateResponseData>>({
      success: true,
      data: {
        imageUrl: `data:image/png;base64,${b64}`,
        revisedPrompt: result.revised_prompt,
      },
    });
  } catch (error) {
    console.error("[API /generate]", error);

    const message =
      error instanceof Error
        ? error.message
        : "画像の生成中に予期しないエラーが発生しました。";

    const status = message.includes("OPENAI_API_KEY") ? 500 : 502;

    return NextResponse.json<ApiResponse<GenerateResponseData>>(
      { success: false, error: message },
      { status }
    );
  }
}
