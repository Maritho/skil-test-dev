// src/lib/loadingStore.ts
import { create } from "zustand";

interface AuthState {
  isLogin: boolean;
  user: object | null;
  setIsLogin: (value: boolean) => void;
  setUser: (value: object | null) => void;
}

export const authStore = create<AuthState>((set) => ({
  isLogin: true,
  user: null,
  setIsLogin: (value) => set({ isLogin: value }),
  setUser: (user) => set({ user }),
}));
