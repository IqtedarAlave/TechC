"use client";
import { createContext, useContext, useEffect, useState } from "react";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "EMPLOYER" | "ADMIN";
  username?: string;       // students
  careerPath?: string;     // students
  companyName?: string;    // employers
};

type SessionCtx = {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => void;
};

const Ctx = createContext<SessionCtx>({ user: null, loading: true, refresh: () => {} });

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Ctx.Provider value={{ user, loading, refresh: load }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSession = () => useContext(Ctx);
