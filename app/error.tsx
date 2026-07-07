"use client";
import { useEffect } from "react";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-6">
      <div className="text-center animate-fade-up">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="text-xl font-display font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-[--text-muted] text-sm mb-6 max-w-sm mx-auto">{error.message}</p>
        <button onClick={reset} className="btn-primary">Try again</button>
      </div>
    </div>
  );
}
