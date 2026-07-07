export type UserRole = "owner" | "lancers" | "guest";

export interface SessionUser {
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const SESSION_COOKIE = "suzuki_toto_session";

export const APPS = [
  {
    id: "voice-ai-image-studio",
    name: "Voice AI Image Studio",
    description:
      "音声操作型・AI画像編集スタジオ。DALL-E 3で生成し、マスク指定＋音声で部分編集できます。",
    href: "/studio",
    status: "available" as const,
    tags: ["AI", "画像生成", "音声認識", "DALL-E 3"],
    icon: "sparkles",
  },
] as const;
