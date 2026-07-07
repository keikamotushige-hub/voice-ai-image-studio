import { NextRequest, NextResponse } from "next/server";
import { bufferToPngFile, getOpenAIClient } from "@/lib/openai";
import { validatePrompt } from "@/lib/content-policy";
import type { ApiResponse, EditResponseData } from "@/lib/types";
import { base64ToBuffer } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, mask, prompt } = body as {
      image?: string;
      mask?: string;
      prompt?: string;
    };

    if (!image || !mask || !prompt?.trim()) {
      return NextResponse.json<ApiResponse<EditResponseData>>(
        {
          success: false,
          error: "画像、マスク、編集プロンプトはすべて必須です。",
        },
        { status: 400 }
      );
    }

    const policyError = validatePrompt(prompt);
    if (policyError) {
      return NextResponse.json<ApiResponse<EditResponseData>>(
        { success: false, error: policyError },
        { status: 403 }
      );
    }

    const imageBuffer = base64ToBuffer(image);
    const maskBuffer = base64ToBuffer(mask);

    if (imageBuffer.length > 4 * 1024 * 1024) {
      return NextResponse.json<ApiResponse<EditResponseData>>(
        {
          success: false,
          error: "画像サイズが4MBを超えています。",
        },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();

    const imageFile = await bufferToPngFile(imageBuffer, "image.png");
    const maskFile = await bufferToPngFile(maskBuffer, "mask.png");

    const response = await openai.images.edit({
      model: "dall-e-2",
      image: imageFile,
      mask: maskFile,
      prompt: prompt.trim(),
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const b64 = response.data?.[0]?.b64_json;

    if (!b64) {
      return NextResponse.json<ApiResponse<EditResponseData>>(
        {
          success: false,
          error: "画像の編集結果を取得できませんでした。",
        },
        { status: 502 }
      );
    }

    return NextResponse.json<ApiResponse<EditResponseData>>({
      success: true,
      data: {
        imageUrl: `data:image/png;base64,${b64}`,
      },
    });
  } catch (error) {
    console.error("[API /edit]", error);

    const message =
      error instanceof Error
        ? error.message
        : "画像の編集中に予期しないエラーが発生しました。";

    const status = message.includes("OPENAI_API_KEY") ? 500 : 502;

    return NextResponse.json<ApiResponse<EditResponseData>>(
      { success: false, error: message },
      { status }
    );
  }
}
