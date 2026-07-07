"use client";

import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface VoiceControlProps {
  isSupported: boolean;
  isListening: boolean;
  displayTranscript: string;
  onToggle: () => void;
  disabled?: boolean;
}

export function VoiceControl({
  isSupported,
  isListening,
  displayTranscript,
  onToggle,
  disabled = false,
}: VoiceControlProps) {
  if (!isSupported) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
        お使いのブラウザは音声認識に対応していません。Chrome または Edge
        をご利用ください。
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button
          variant={isListening ? "danger" : "secondary"}
          size="lg"
          onClick={onToggle}
          disabled={disabled}
          className={cn(
            "relative min-w-[160px]",
            isListening && "animate-pulse"
          )}
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5" />
              音声認識を停止
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              音声で指示
            </>
          )}
          {isListening && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
          )}
        </Button>

        {isListening && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Volume2 className="h-4 w-4 animate-pulse" />
            聞き取り中...
          </div>
        )}
      </div>

      {displayTranscript && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3">
          <p className="mb-1 text-xs font-medium text-zinc-500">音声テキスト</p>
          <p className="text-sm leading-relaxed text-zinc-200">
            {displayTranscript}
            {isListening && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-violet-400" />
            )}
          </p>
        </div>
      )}

      <p className="text-xs text-zinc-600">
        マイクボタンを押して「この部分を〇〇に変えて」と話すと、AIが自動で修正します。
      </p>
    </div>
  );
}
