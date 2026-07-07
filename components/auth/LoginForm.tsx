"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import { parseApiResponse } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/studio";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("利用規約への同意が必要です。");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      await parseApiResponse(response);
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ログインに失敗しました。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (type: "owner" | "lancers") => {
    if (type === "owner") {
      setEmail("keikamotushige@gmail.com");
      setPassword("owner2026!");
    } else {
      setEmail("lancers@test.com");
      setPassword("lancers2026!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/30">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Suzuki Toto Service</h1>
          <p className="mt-2 text-sm text-zinc-500">ログインしてアプリを利用</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl"
        >
          <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
            <Lock className="h-4 w-4" />
            認証が必要です
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <label className="mb-2 block text-sm text-zinc-400">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
            placeholder="email@example.com"
            required
          />

          <label className="mb-2 block text-sm text-zinc-400">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
            placeholder="パスワード"
            required
          />

          <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-600"
            />
            <span className="text-xs leading-relaxed text-zinc-400">
              <Link href="/terms" className="text-violet-400 hover:underline">
                利用規約
              </Link>
              に同意します。生成・編集コンテンツの責任は自分が負い、著作権侵害・違法行為を行わないことを確認しました。
            </span>
          </label>

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!agreedToTerms}
            className="w-full"
          >
            <LogIn className="h-4 w-4" />
            ログイン
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
          <p className="mb-3 text-xs font-medium text-zinc-500">
            テスト用アカウント（クリックで入力）
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fillDemo("owner")}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left text-xs text-amber-300 transition hover:bg-amber-500/20"
            >
              <span className="font-semibold">オーナー</span>
              <br />
              keikamotushige@gmail.com
            </button>
            <button
              type="button"
              onClick={() => fillDemo("lancers")}
              className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-left text-xs text-blue-300 transition hover:bg-blue-500/20"
            >
              <span className="font-semibold">ランサーズテスト</span>
              <br />
              lancers@test.com
            </button>
          </div>
        </div>

        <p className="mt-4 text-center">
          <LegalDisclaimer compact />
        </p>
        <p className="mt-2 text-center text-xs text-zinc-600">
          <a href="/" className="hover:text-zinc-400">
            ← サービス一覧に戻る
          </a>
        </p>
      </div>
    </div>
  );
}
