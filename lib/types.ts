export type HistoryItemType = "generate" | "edit" | "upload";

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export interface GenerateRequest {
  prompt: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
}

export interface EditRequest {
  image: string;
  mask: string;
  prompt: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface GenerateResponseData {
  imageUrl: string;
  revisedPrompt?: string;
}

export interface EditResponseData {
  imageUrl: string;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
