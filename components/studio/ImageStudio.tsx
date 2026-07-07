"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import {
  ImageCanvas,
} from "@/components/canvas/ImageCanvas";
import type { MaskDrawingToolHandle } from "@/components/canvas/MaskDrawingTool";
import { PromptInput } from "@/components/generation/PromptInput";
import { HistoryPanel } from "@/components/history/HistoryPanel";
import { Header, OwnerPanel } from "@/components/layout/Header";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import { ImageDropZone } from "@/components/upload/ImageDropZone";
import { VoiceControl } from "@/components/voice/VoiceControl";
import { Button } from "@/components/ui/Button";
import { useImageHistory } from "@/hooks/useImageHistory";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useToast } from "@/components/ui/ToastProvider";
import { prepareImageForEdit } from "@/lib/imageProcessing";
import type { SessionUser } from "@/lib/auth-types";
import type {
  EditResponseData,
  GenerateResponseData,
} from "@/lib/types";
import { parseApiResponse } from "@/lib/utils";

type StudioMode = "generate" | "edit";

interface ImageStudioProps {
  user: SessionUser;
}

export function ImageStudio({ user }: ImageStudioProps) {
  const router = useRouter();
  const isOwner = user.role === "owner";
  const { showToast } = useToast();
  const {
    history,
    activeId,
    addHistoryItem,
    selectHistoryItem,
    clearHistory,
  } = useImageHistory();

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [mode, setMode] = useState<StudioMode>("generate");
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasMask, setHasMask] = useState(false);

  const maskRef = useRef<MaskDrawingToolHandle>(null);
  const isProcessingRef = useRef(false);

  const handleGenerate = useCallback(
    async (prompt: string) => {
      setIsGenerating(true);
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            size: "1024x1024",
            quality: isOwner ? "hd" : "standard",
          }),
        });

        const data = await parseApiResponse<GenerateResponseData>(response);
        setCurrentImage(data.imageUrl);
        addHistoryItem("generate", data.imageUrl, prompt);
        setMode("edit");
        setGeneratePrompt("");
        showToast("success", "画像を生成しました！");

        if (data.revisedPrompt) {
          showToast("info", `最適化プロンプト: ${data.revisedPrompt}`, 8000);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "画像の生成に失敗しました。";
        showToast("error", message);
      } finally {
        setIsGenerating(false);
      }
    },
    [addHistoryItem, showToast, isOwner]
  );

  const handleEdit = useCallback(
    async (prompt: string) => {
      if (!currentImage) {
        showToast("warning", "先に画像を読み込むか生成してください。");
        return;
      }

      if (!maskRef.current?.hasMask()) {
        showToast("warning", "修正したい範囲をマスクでなぞってください。");
        return;
      }

      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      setIsEditing(true);

      try {
        const maskDataUrl = await maskRef.current.exportMask();
        if (!maskDataUrl) {
          showToast("warning", "マスクのエクスポートに失敗しました。");
          return;
        }

        const prepared = await prepareImageForEdit(currentImage, maskDataUrl);

        const response = await fetch("/api/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: prepared.image,
            mask: prepared.mask,
            prompt,
          }),
        });

        const data = await parseApiResponse<EditResponseData>(response);
        setCurrentImage(data.imageUrl);
        addHistoryItem("edit", data.imageUrl, prompt);
        maskRef.current.clearMask();
        setHasMask(false);
        setEditPrompt("");
        showToast("success", "画像を編集しました！");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "画像の編集に失敗しました。";
        showToast("error", message);
      } finally {
        setIsEditing(false);
        isProcessingRef.current = false;
      }
    },
    [currentImage, addHistoryItem, showToast]
  );

  const handleVoiceResult = useCallback(
    (transcript: string, isFinal: boolean) => {
      if (!isFinal || !transcript) return;

      if (currentImage && hasMask) {
        setEditPrompt(transcript);
        handleEdit(transcript);
      } else if (!currentImage) {
        setGeneratePrompt(transcript);
        handleGenerate(transcript);
      } else {
        showToast(
          "info",
          "編集するには、まず修正範囲をマスクでなぞってください。"
        );
      }
    },
    [currentImage, hasMask, handleEdit, handleGenerate, showToast]
  );

  const {
    isSupported,
    isListening,
    displayTranscript,
    toggleListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: "ja-JP",
    onResult: handleVoiceResult,
    onError: (error) => {
      if (error === "not-allowed") {
        showToast("error", "マイクの使用が許可されていません。");
      } else if (error === "network") {
        showToast("error", "ネットワークエラーが発生しました。");
      } else {
        showToast("error", `音声認識エラー: ${error}`);
      }
    },
  });

  const handleImageLoad = useCallback(
    (dataUrl: string, fileName: string) => {
      setCurrentImage(dataUrl);
      addHistoryItem("upload", dataUrl, fileName);
      setMode("edit");
      maskRef.current?.clearMask();
      setHasMask(false);
      showToast("success", "画像を読み込みました。");
    },
    [addHistoryItem, showToast]
  );

  const handleHistorySelect = useCallback(
    (id: string) => {
      selectHistoryItem(id);
      const item = history.find((h) => h.id === id);
      if (item) {
        setCurrentImage(item.imageUrl);
        setMode("edit");
        maskRef.current?.clearMask();
        setHasMask(false);
      }
    },
    [history, selectHistoryItem]
  );

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }, [router]);

  const isBusy = isGenerating || isEditing;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
      <Header user={user} onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            <section className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden p-4">
                <ImageDropZone
                  onImageLoad={handleImageLoad}
                  onError={(msg) => showToast("error", msg)}
                  hasImage={!!currentImage}
                >
                  {currentImage && (
                    <ImageCanvas
                      ref={maskRef}
                      imageUrl={currentImage}
                      disabled={isBusy}
                      onMaskChange={setHasMask}
                    />
                  )}
                </ImageDropZone>
              </div>
            </section>

            <aside className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-zinc-800/80 bg-zinc-950/80 p-4">
              <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/50 p-1">
                <button
                  onClick={() => setMode("generate")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    mode === "generate"
                      ? "bg-violet-600 text-white shadow"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  新規生成
                </button>
                <button
                  onClick={() => setMode("edit")}
                  disabled={!currentImage}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition disabled:opacity-40 ${
                    mode === "edit"
                      ? "bg-fuchsia-600 text-white shadow"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  マスク編集
                </button>
              </div>

              {mode === "generate" ? (
                <PromptInput
                  mode="generate"
                  value={generatePrompt}
                  onChange={setGeneratePrompt}
                  onSubmit={handleGenerate}
                  isLoading={isGenerating}
                  disabled={isBusy}
                />
              ) : (
                <PromptInput
                  mode="edit"
                  value={editPrompt}
                  onChange={setEditPrompt}
                  onSubmit={handleEdit}
                  isLoading={isEditing}
                  disabled={isBusy || !currentImage}
                />
              )}

              {isOwner && <OwnerPanel />}

              <LegalDisclaimer />

              <div className="border-t border-zinc-800 pt-4">
                <VoiceControl
                  isSupported={isSupported}
                  isListening={isListening}
                  displayTranscript={displayTranscript}
                  onToggle={() => {
                    if (isListening) {
                      toggleListening();
                    } else {
                      resetTranscript();
                      toggleListening();
                    }
                  }}
                  disabled={isBusy}
                />
              </div>

              {currentImage && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCurrentImage(null);
                    setMode("generate");
                    maskRef.current?.clearMask();
                    setHasMask(false);
                  }}
                  disabled={isBusy}
                >
                  <ImagePlus className="h-4 w-4" />
                  新しい画像を読み込む
                </Button>
              )}
            </aside>
          </div>
        </main>

        <HistoryPanel
          history={history}
          activeId={activeId}
          onSelect={handleHistorySelect}
          onClear={clearHistory}
        />
      </div>
    </div>
  );
}
