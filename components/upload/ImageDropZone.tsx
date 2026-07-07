"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { cn, fileToDataUrl, isImageFile } from "@/lib/utils";

interface ImageDropZoneProps {
  onImageLoad: (dataUrl: string, fileName: string) => void;
  onError: (message: string) => void;
  hasImage: boolean;
  children?: React.ReactNode;
}

export function ImageDropZone({
  onImageLoad,
  onError,
  hasImage,
  children,
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!isImageFile(file)) {
        onError("画像ファイル（PNG, JPG, WebP等）を選択してください。");
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        onError("ファイルサイズは4MB以下にしてください。");
        return;
      }

      try {
        const dataUrl = await fileToDataUrl(file);
        onImageLoad(dataUrl, file.name);
      } catch {
        onError("ファイルの読み込みに失敗しました。");
      }
    },
    [onImageLoad, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  if (hasImage && children) {
    return <>{children}</>;
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "flex h-full min-h-[400px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-300",
        isDragging
          ? "border-violet-500 bg-violet-500/10"
          : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-900/50"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/80">
        {isDragging ? (
          <ImagePlus className="h-8 w-8 text-violet-400" />
        ) : (
          <Upload className="h-8 w-8 text-zinc-500" />
        )}
      </div>
      <div className="text-center">
        <p className="text-base font-medium text-zinc-300">
          画像をドラッグ＆ドロップ
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          またはクリックしてファイルを選択
        </p>
        <p className="mt-3 text-xs text-zinc-600">PNG, JPG, WebP（最大4MB）</p>
      </div>
    </div>
  );
}
