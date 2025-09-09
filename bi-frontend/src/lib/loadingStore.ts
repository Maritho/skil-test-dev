// src/lib/loadingStore.ts
import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const loadingStore = create<LoadingState>((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),
}));
