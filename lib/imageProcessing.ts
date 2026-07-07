import { loadImage } from "./utils";

const EDIT_SIZE = 1024;

export async function prepareImageForEdit(
  imageDataUrl: string,
  maskDataUrl: string
): Promise<{ image: string; mask: string }> {
  const img = await loadImage(imageDataUrl);
  const maskImg = await loadImage(maskDataUrl);

  const imageCanvas = document.createElement("canvas");
  const maskCanvas = document.createElement("canvas");
  imageCanvas.width = EDIT_SIZE;
  imageCanvas.height = EDIT_SIZE;
  maskCanvas.width = EDIT_SIZE;
  maskCanvas.height = EDIT_SIZE;

  const imageCtx = imageCanvas.getContext("2d");
  const maskCtx = maskCanvas.getContext("2d");

  if (!imageCtx || !maskCtx) {
    throw new Error("Canvas context の取得に失敗しました");
  }

  const scale = Math.min(EDIT_SIZE / img.width, EDIT_SIZE / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const offsetX = (EDIT_SIZE - drawWidth) / 2;
  const offsetY = (EDIT_SIZE - drawHeight) / 2;

  imageCtx.fillStyle = "#000000";
  imageCtx.fillRect(0, 0, EDIT_SIZE, EDIT_SIZE);
  imageCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  maskCtx.fillStyle = "rgba(0, 0, 0, 1)";
  maskCtx.fillRect(0, 0, EDIT_SIZE, EDIT_SIZE);
  maskCtx.drawImage(maskImg, offsetX, offsetY, drawWidth, drawHeight);

  return {
    image: imageCanvas.toDataURL("image/png"),
    mask: maskCanvas.toDataURL("image/png"),
  };
}
