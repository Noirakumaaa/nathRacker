// store/useToastStore.ts
import { create } from "zustand";
import type {  ToastStore } from "~/types/toastType";

export const useToastStore = create<ToastStore>((set) => ({
  open: false,
  statusMessage: "",
  toastStatus: "success",
  show: (statusMessage, toastStatus) => {
  set({ open: true, statusMessage, toastStatus });
  setTimeout(() => set({ open: false }), 3000); 
},
  hide: () => set({ open: false }),
}));