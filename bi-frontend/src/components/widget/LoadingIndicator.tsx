// src/components/LoadingIndicator.tsx
"use client";

import { loadingStore } from "@/lib/loadingStore";

export default function LoadingIndicator() {
  const loading = loadingStore((state) => state.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
