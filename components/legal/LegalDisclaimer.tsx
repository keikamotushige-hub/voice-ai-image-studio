import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { LEGAL_NOTICE_SHORT } from "@/lib/content-policy";

interface LegalDisclaimerProps {
  compact?: boolean;
}

export function LegalDisclaimer({ compact = false }: LegalDisclaimerProps) {
  if (compact) {
    return (
      <p className="text-[10px] leading-relaxed text-zinc-600">
        {LEGAL_NOTICE_SHORT}{" "}
        <Link href="/terms" className="text-violet-500 hover:underline">
          利用規約
        </Link>
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <div className="text-xs leading-relaxed text-zinc-400">
          <p className="font-medium text-amber-300">重要：法的免責事項</p>
          <p className="mt-1">
            生成・編集された画像の利用は
            <strong className="text-zinc-300">利用者自身の責任</strong>
            で行ってください。著作権侵害・違法行為は禁止されています。運営者は一切の責任を負いません。
          </p>
          <Link
            href="/terms"
            className="mt-2 inline-block text-violet-400 hover:text-violet-300"
          >
            利用規約を読む →
          </Link>
        </div>
      </div>
    </div>
  );
}
