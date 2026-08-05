import { create } from "zustand";
import axios from "axios";
import { API_URL } from "./config";

export const useNotificationStore = create((set) => ({
  number: 0,

  fetchChats: async () => {
    try {
      const res = await axios.get(
        `${API_URL}/users/notification`,
        { withCredentials: true }
      );
      const count = typeof res.data === "object" ? res.data.count || 0 : res.data;
      set({ number: Number(count) || 0 });
    } catch (err) {
      console.error("❌ Failed fetching notification count:", err);
    }
  },

  increase: () => set((prev) => ({ number: prev.number + 1 })),
  decrease: () => set((prev) => ({ number: Math.max(0, prev.number - 1) })),
  reset: () => set({ number: 0 }),
}));
