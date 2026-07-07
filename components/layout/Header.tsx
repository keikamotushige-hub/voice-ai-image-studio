"use client";

import { Crown, Shield, Sparkles, LogOut, Home } from "lucide-react";
import Link from "next/link";
import type { SessionUser } from "@/lib/auth-types";
import { cn } from "@/lib/utils";

interface HeaderProps {
  user?: SessionUser | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const isOwner = user?.role === "owner";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Voice AI Image Studio
          </h1>
          <p className="text-xs text-zinc-500">
            音声操作型・AI画像編集スタジオ
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden items-center gap-2 sm:flex">
            {isOwner ? (
              <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                <Crown className="h-3 w-3" />
                オーナー
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                <Shield className="h-3 w-3" />
                {user.name}
              </span>
            )}
            <span className="text-xs text-zinc-600">{user.email}</span>
          </div>
        )}

        <Link
          href="/"
          className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300"
          title="サービス一覧"
        >
          <Home className="h-4 w-4" />
        </Link>

        {onLogout && (
          <button
            onClick={onLogout}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-red-400"
            title="ログアウト"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}

export function OwnerPanel() {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Crown className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-amber-300">
          オーナー専用モード
        </h3>
      </div>
      <ul className="space-y-1.5 text-xs text-zinc-400">
        <li className={cn("flex items-center gap-2")}>
          <span className="h-1 w-1 rounded-full bg-amber-400" />
          全機能が無制限で利用可能
        </li>
        <li className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-amber-400" />
          HD品質での画像生成が可能
        </li>
        <li className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-amber-400" />
          優先処理（オーナー体験）
        </li>
      </ul>
    </div>
  );
}
