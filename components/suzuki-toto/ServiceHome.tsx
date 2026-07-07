"use client";

import Link from "next/link";
import {
  ArrowRight,
  Crown,
  LogIn,
  Mic,
  Sparkles,
  Wand2,
} from "lucide-react";
import { APPS } from "@/lib/auth-types";
import { LegalFooter } from "@/components/legal/LegalFooter";

const iconMap = {
  sparkles: Sparkles,
};

export function ServiceHome() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-400">
              Suzuki Toto Service
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">
              開発アプリ一覧
            </h1>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-violet-500/50 hover:text-white"
          >
            <LogIn className="h-4 w-4" />
            ログイン
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="mb-10 rounded-2xl border border-zinc-800 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600/20">
              <Crown className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                オーナー：keikamotushige@gmail.com
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Suzuki Toto Service
                で開発したアプリケーションを一覧で管理・公開しています。
                ログイン後、各アプリをご利用いただけます。
              </p>
            </div>
          </div>
        </section>

        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
          アプリケーション
        </h2>

        <div className="grid gap-4">
          {APPS.map((app) => {
            const Icon = iconMap[app.icon as keyof typeof iconMap] ?? Sparkles;
            return (
              <article
                key={app.id}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-violet-500/40 hover:bg-zinc-900"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/20">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">
                          {app.name}
                        </h3>
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                          利用可能
                        </span>
                      </div>
                      <p className="mt-1 max-w-xl text-sm text-zinc-400">
                        {app.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {app.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[10px] text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Wand2 className="h-3 w-3" /> 画像生成
                        </span>
                        <span className="flex items-center gap-1">
                          <Mic className="h-3 w-3" /> 音声操作
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/login?redirect=/studio"
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition group-hover:bg-violet-500"
                  >
                    ログインして使う
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
