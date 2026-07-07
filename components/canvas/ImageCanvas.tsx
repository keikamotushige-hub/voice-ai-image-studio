"use client";

import { forwardRef } from "react";
import {
  MaskDrawingTool,
  type MaskDrawingToolHandle,
} from "@/components/canvas/MaskDrawingTool";

interface ImageCanvasProps {
  imageUrl: string;
  disabled?: boolean;
  onMaskChange?: (hasMask: boolean) => void;
}

export const ImageCanvas = forwardRef<MaskDrawingToolHandle, ImageCanvasProps>(
  function ImageCanvas({ imageUrl, disabled, onMaskChange }, ref) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <MaskDrawingTool
          ref={ref}
          imageUrl={imageUrl}
          disabled={disabled}
          onMaskChange={onMaskChange}
          brushSize={32}
        />
      </div>
    );
  }
);
