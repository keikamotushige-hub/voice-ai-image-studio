"use client";

import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Gamepad2,
  LogIn,
  Mic,
  Sparkles,
  Wand2,
} from "lucide-react";
import { PRODUCTION_URL } from "@/lib/auth-types";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_NAME_JA,
  APP_TAGLINE,
} from "@/lib/brand";
import { PORTFOLIO } from "@/lib/portfolio";
import { LegalFooter } from "@/components/legal/LegalFooter";

function PortfolioIcon({ type }: { type: "app" | "game" }) {
  if (type === "game") {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-amber-600 shadow-lg shadow-red-700/20">
        <Gamepad2 className="h-7 w-7 text-white" />
      </div>
    );
  }
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 shadow-lg shadow-blue-600/20">
      <Sparkles className="h-7 w-7 text-white" />
    </div>
  );
}

export function ServiceHome() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="safe-top border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
              Suzuki Toto Service
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">
              制作ポートフォリオ
            </h1>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-blue-500/50 hover:text-white"
          >
            <LogIn className="h-4 w-4" />
            ログイン
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
            公開URL（本番）
          </p>
          <p className="mt-1 text-sm text-blue-300">
            Suzuki Toto Service — Webアプリ・ゲーム制作
          </p>
          <a
            href={PRODUCTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-white hover:text-emerald-300"
          >
            {PRODUCTION_URL}
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-gradient-to-br from-blue-600/10 to-sky-600/10 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/20">
              <Sparkles className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {APP_NAME}（{APP_NAME_JA}）
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {APP_DESCRIPTION}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Wand2 className="h-3 w-3" /> 画像生成
                </span>
                <span className="flex items-center gap-1">
                  <Mic className="h-3 w-3" /> 音声操作
                </span>
              </div>
            </div>
          </div>
        </section>

        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          制作実績
        </h2>

        <div className="flex flex-col gap-4">
          {PORTFOLIO.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <PortfolioIcon type={item.type} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                        {item.subtitle ? (
                          <span className="ml-2 text-sm font-normal text-zinc-400">
                            — {item.subtitle}
                          </span>
                        ) : null}
                      </h3>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                        {item.status === "available" ? "公開中" : "要ログイン"}
                      </span>
                    </div>
                    <p className="mt-1 max-w-xl text-sm text-zinc-400">
                      {item.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[10px] text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <a
                    href={item.url}
                    target={item.url.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.url.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={
                      item.type === "game"
                        ? "inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-red-700/20 transition hover:bg-red-600"
                        : "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
                    }
                  >
                    {item.ctaLabel}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  {item.loginHref ? (
                    <Link
                      href={item.loginHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                    >
                      ログインして使う
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
