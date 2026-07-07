"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning";
type Toast = { id: number; type: ToastType; message: string };
type ToastCtx = { toast: (type: ToastType, message: string) => void };

const Ctx = createContext<ToastCtx>({ toast: () => {} });

let _id = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = ++_id;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const ICONS = {
    success: <CheckCircle className="w-4 h-4 text-accent-400 shrink-0" />,
    error:   <XCircle    className="w-4 h-4 text-red-400 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />,
  };
  const BG = {
    success: "border-accent-500/30 bg-accent-500/10",
    error:   "border-red-500/30 bg-red-500/10",
    warning: "border-yellow-500/30 bg-yellow-500/10",
  };

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${BG[t.type]} animate-fade-up shadow-xl`}>
            {ICONS[t.type]}
            <p className="text-sm text-[--text] flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-[--text-muted] hover:text-[--text]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
