"use client";

import { Clock, Eraser, ImageIcon, Pencil, Upload, Wand2 } from "lucide-react";
import type { HistoryItem } from "@/lib/types";
import { cn, formatTimestamp } from "@/lib/utils";

const typeConfig = {
  generate: {
    icon: Wand2,
    label: "生成",
    color: "text-violet-400",
  },
  edit: {
    icon: Pencil,
    label: "編集",
    color: "text-fuchsia-400",
  },
  upload: {
    icon: Upload,
    label: "アップロード",
    color: "text-emerald-400",
  },
};

interface HistoryPanelProps {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  history,
  activeId,
  onSelect,
  onClear,
}: HistoryPanelProps) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-l border-zinc-800/80 bg-zinc-950/60">
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-200">履歴</h2>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {history.length}
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-red-400"
          >
            <Eraser className="h-3 w-3" />
            クリア
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {history.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <ImageIcon className="h-10 w-10 text-zinc-700" />
            <p className="text-sm text-zinc-500">
              生成・編集した画像がここに表示されます
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;
              const isActive = item.id === activeId;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "group w-full rounded-xl border p-2 text-left transition-all duration-200",
                      isActive
                        ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                        : "border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                    )}
                  >
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon className={cn("h-3 w-3", config.color)} />
                      <span className={cn("text-xs font-medium", config.color)}>
                        {config.label}
                      </span>
                      <span className="ml-auto text-[10px] text-zinc-600">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                      {item.prompt}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
