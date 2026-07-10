import { PRODUCTION_URL } from "@/lib/auth-types";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_NAME_JA,
} from "@/lib/brand";

export type PortfolioEntry = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  tags: string[];
  status: "available" | "login";
  type: "app" | "game";
  ctaLabel: string;
  loginHref?: string;
};

export const PORTFOLIO: PortfolioEntry[] = [
  {
    id: "voxcanvas",
    title: APP_NAME,
    subtitle: APP_NAME_JA,
    description: APP_DESCRIPTION,
    url: PRODUCTION_URL,
    tags: ["AI", "画像生成", "音声認識", "GPT Image"],
    status: "available",
    type: "app",
    ctaLabel: "本番URLを開く",
    loginHref: "/login?redirect=/studio",
  },
  {
    id: "pochipochi",
    title: "配達員・逆襲のポチポチ",
    subtitle: "バズる置き配ゲーム",
    description:
      "配達アプリ風UIで通知カードをタップして粉砕。感謝率・応答率・停止リスク・売上手数料を管理しながらストレスを解放するワンタップゲーム。",
    url: "/games/okii-pai-puzzle/",
    tags: ["ゲーム", "モバイル", "カジュアル", "HTML5"],
    status: "available",
    type: "game",
    ctaLabel: "プレイする",
  },
];
