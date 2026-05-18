import { create } from "zustand";
import apiRequest from "./apiRequest";
import { number } from "zod";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetchChats: async () => {
    const res = await apiRequest("users/notification");
    set({ number: res.data });
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
