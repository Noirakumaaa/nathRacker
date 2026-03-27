import { toastConfig } from "component/toastConfig";

export type ToastStatus = "success" | "error" | "loading";

export type ToastStatusZustand = keyof typeof toastConfig;

export interface ToastProps {
  statusMessage: string;
  toastStatus: keyof typeof toastConfig;
  toastConfig: Record<string, { accent: string; icon: React.ReactNode }>;
}


export interface ToastStore {
  open: boolean;
  statusMessage: string;
  toastStatus: ToastStatus;
  show: (message: string, status: ToastStatus) => void;
  hide: () => void;
}
