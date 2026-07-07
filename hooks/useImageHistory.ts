"use client";

import { useCallback, useState } from "react";
import type { HistoryItem, HistoryItemType } from "@/lib/types";
import { generateId } from "@/lib/utils";

export function useImageHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const addHistoryItem = useCallback(
    (type: HistoryItemType, imageUrl: string, prompt: string) => {
      const item: HistoryItem = {
        id: generateId(),
        type,
        imageUrl,
        prompt,
        timestamp: Date.now(),
      };
      setHistory((prev) => [item, ...prev]);
      setActiveId(item.id);
      return item;
    },
    []
  );

  const selectHistoryItem = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const getActiveItem = useCallback(() => {
    return history.find((item) => item.id === activeId) ?? null;
  }, [history, activeId]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setActiveId(null);
  }, []);

  return {
    history,
    activeId,
    addHistoryItem,
    selectHistoryItem,
    getActiveItem,
    clearHistory,
  };
}
