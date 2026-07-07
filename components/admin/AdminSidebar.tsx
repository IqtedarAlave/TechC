"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, FileCheck, Award, Settings, LogOut, ShieldAlert, Loader2 } from "lucide-react";
import { useSession } from "@/context/SessionContext";

const NAV = [
  { href: "/admin/dashboard",   label: "Overview",    icon: LayoutDashboard },
  { href: "/admin/users",       label: "All users",   icon: Users },
  { href: "/admin/companies",   label: "Companies",   icon: Building2 },
  { href: "/admin/submissions", label: "Submissions", icon: FileCheck },
  { href: "/admin/badges",      label: "Badges",      icon: Award },
];

export function AdminSidebar() {
  const path = usePathname();
  const { user, loading } = useSession();
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 border-r border-surface-border bg-surface-card flex flex-col">
      <div className="h-16 flex items-center px-5 border-b border-surface-border gap-2">
        <span className="font-display font-bold text-xl text-white">Tech<span className="text-gradient">C</span></span>
        <span className="badge-red text-[10px] flex items-center gap-0.5"><ShieldAlert className="w-2.5 h-2.5" /> Admin</span>
      </div>
      <div className="px-3 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-muted">
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-[--text-muted]" /> : (
            <>
              <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-red-300 font-bold text-xs shrink-0">{user?.name?.[0] ?? "A"}</div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[--text] truncate">{user?.name ?? "Admin"}</p>
                <p className="text-[10px] text-[--text-muted]">Platform admin</p>
              </div>
            </>
          )}
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`nav-item ${path.startsWith(href) ? "active" : ""}`}>
            <Icon className="w-4 h-4 shrink-0" /> {label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-surface-border space-y-0.5">
        <Link href="/admin/settings" className={`nav-item ${path === "/admin/settings" ? "active" : ""}`}>
          <Settings className="w-4 h-4" /> Settings
        </Link>
        <button onClick={handleLogout} className="nav-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
