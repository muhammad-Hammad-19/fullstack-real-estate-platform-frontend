import axios from "axios";
import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  number: 0,

  // Axios ke saath API hit karna aur state update karna
  fetchChats: async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/users/notification",
        {
          withCredentials: true,
        },
      );

      // Axios automatically data ko 'res.data' mein wrap karta hai
      // Agar backend se direct number aa raha hai to res.data, agar object hai to res.data.number lagayein
      set({ number: res.data });
    } catch (err) {
      console.error("Notification fetch karne mein masla hua:", err);
    }
  },

  // Notification count 1 kam karne ke liye
  decrease: () => set((prev) => ({ number: Math.max(0, prev.number - 1) })), // Math.max se number minus me nahi jayega

  // Notification reset karne ke liye
  reset: () => set({ number: 0 }),
}));
