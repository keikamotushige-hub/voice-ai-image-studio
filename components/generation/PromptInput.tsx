"use client";

import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PromptInputProps {
  mode: "generate" | "edit";
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const placeholders = {
  generate:
    "例: 夕暮れの富士山を背景にしたサイバーパンク風の東京の街並み...",
  edit: "例: この部分を青い空と白い雲に変えて...",
};

export function PromptInput({
  mode,
  onSubmit,
  isLoading = false,
  disabled = false,
  value: controlledValue,
  onChange,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue ?? internalValue;
  const setValue = onChange ?? setInternalValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading || disabled) return;
    onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-zinc-300">
        {mode === "generate" ? (
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            画像生成プロンプト
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-fuchsia-400" />
            編集プロンプト
          </span>
        )}
      </label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholders[mode]}
        rows={3}
        disabled={disabled || isLoading}
        className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
      />
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={!value.trim() || disabled}
        className="w-full"
      >
        {mode === "generate" ? (
          <>
            <Sparkles className="h-4 w-4" />
            DALL-E 3 で生成
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            マスク範囲を編集
          </>
        )}
      </Button>
    </form>
  );
}
