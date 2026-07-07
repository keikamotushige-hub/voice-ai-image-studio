"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Eraser, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loadImage } from "@/lib/utils";

export interface MaskDrawingToolHandle {
  exportMask: () => Promise<string | null>;
  clearMask: () => void;
  hasMask: () => boolean;
}

interface MaskDrawingToolProps {
  imageUrl: string;
  brushSize?: number;
  disabled?: boolean;
  onMaskChange?: (hasMask: boolean) => void;
}

export const MaskDrawingTool = forwardRef<
  MaskDrawingToolHandle,
  MaskDrawingToolProps
>(function MaskDrawingTool(
  { imageUrl, brushSize = 30, disabled = false, onMaskChange },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasMaskStrokes, setHasMaskStrokes] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawImageToCanvas = useCallback(() => {
    const canvas = displayCanvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  const initCanvases = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const img = await loadImage(imageUrl);
      imageRef.current = img;

      const maxWidth = container.clientWidth;
      const maxHeight = container.clientHeight - 60;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      setDimensions({ width, height });

      const displayCanvas = displayCanvasRef.current;
      const maskCanvas = maskCanvasRef.current;

      if (displayCanvas && maskCanvas) {
        displayCanvas.width = width;
        displayCanvas.height = height;
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;

        const maskCtx = maskCanvas.getContext("2d");
        if (maskCtx) {
          maskCtx.fillStyle = "rgba(0, 0, 0, 1)";
          maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        }

        drawImageToCanvas();
      }
    } catch {
      // Parent handles image load errors
    }
  }, [imageUrl, drawImageToCanvas]);

  useEffect(() => {
    initCanvases();

    const handleResize = () => initCanvases();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvases]);

  const getPosition = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = displayCanvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!canvas || !maskCanvas) return null;

      const rect = canvas.getBoundingClientRect();
      const displayX = e.clientX - rect.left;
      const displayY = e.clientY - rect.top;

      const scaleX = maskCanvas.width / canvas.width;
      const scaleY = maskCanvas.height / canvas.height;

      return {
        displayX,
        displayY,
        maskX: displayX * scaleX,
        maskY: displayY * scaleY,
      };
    },
    []
  );

  const drawStroke = useCallback(
    (displayX: number, displayY: number, maskX: number, maskY: number) => {
      const displayCanvas = displayCanvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!displayCanvas || !maskCanvas) return;

      const displayCtx = displayCanvas.getContext("2d");
      const maskCtx = maskCanvas.getContext("2d");
      if (!displayCtx || !maskCtx) return;

      const displayRadius = brushSize / 2;
      const maskRadius =
        (brushSize / 2) * (maskCanvas.width / displayCanvas.width);

      displayCtx.save();
      displayCtx.globalAlpha = 0.45;
      displayCtx.fillStyle = "#f472b6";
      displayCtx.beginPath();
      displayCtx.arc(displayX, displayY, displayRadius, 0, Math.PI * 2);
      displayCtx.fill();
      displayCtx.restore();

      maskCtx.save();
      maskCtx.globalCompositeOperation = "destination-out";
      maskCtx.beginPath();
      maskCtx.arc(maskX, maskY, maskRadius, 0, Math.PI * 2);
      maskCtx.fill();
      maskCtx.restore();

      setHasMaskStrokes(true);
      onMaskChange?.(true);
    },
    [brushSize, onMaskChange]
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (disabled) return;
      setIsDrawing(true);
      const pos = getPosition(e);
      if (pos) drawStroke(pos.displayX, pos.displayY, pos.maskX, pos.maskY);
    },
    [disabled, getPosition, drawStroke]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || disabled) return;
      const pos = getPosition(e);
      if (pos) drawStroke(pos.displayX, pos.displayY, pos.maskX, pos.maskY);
    },
    [isDrawing, disabled, getPosition, drawStroke]
  );

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearMask = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!displayCanvas || !maskCanvas) return;

    drawImageToCanvas();

    const maskCtx = maskCanvas.getContext("2d");
    if (maskCtx) {
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.fillStyle = "rgba(0, 0, 0, 1)";
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    }

    setHasMaskStrokes(false);
    onMaskChange?.(false);
  }, [drawImageToCanvas, onMaskChange]);

  const exportMask = useCallback(async (): Promise<string | null> => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || !hasMaskStrokes) return null;

    return maskCanvas.toDataURL("image/png");
  }, [hasMaskStrokes]);

  useImperativeHandle(
    ref,
    () => ({
      exportMask,
      clearMask,
      hasMask: () => hasMaskStrokes,
    }),
    [exportMask, clearMask, hasMaskStrokes]
  );

  return (
    <div ref={containerRef} className="flex h-full flex-col items-center gap-3">
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 shadow-inner">
        <canvas
          ref={displayCanvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          className="cursor-crosshair rounded-lg"
          style={{
            width: dimensions.width || "auto",
            height: dimensions.height || "auto",
          }}
        />
        <canvas ref={maskCanvasRef} className="hidden" />
        {disabled && (
          <div className="absolute inset-2 flex items-center justify-center rounded-lg bg-zinc-950/60 backdrop-blur-sm">
            <p className="text-sm text-zinc-400">処理中...</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-400">
          <Paintbrush className="h-3.5 w-3.5 text-fuchsia-400" />
          修正範囲をなぞって指定
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearMask}
          disabled={!hasMaskStrokes || disabled}
        >
          <Eraser className="h-3.5 w-3.5" />
          マスクをクリア
        </Button>
      </div>
    </div>
  );
});
