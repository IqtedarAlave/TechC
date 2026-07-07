"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, FolderGit2, Award,
  Briefcase, UserCircle, Settings, LogOut, ChevronRight, Loader2,
} from "lucide-react";
import { useSession } from "@/context/SessionContext";

const NAV = [
  { href: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/roadmap",   label: "My Roadmap", icon: Map },
  { href: "/projects",  label: "Projects",   icon: FolderGit2 },
  { href: "/badges",    label: "Badges",     icon: Award },
  { href: "/jobs",      label: "Jobs",       icon: Briefcase },
];

const BOTTOM_NAV = [
  { href: "/profile",  label: "Profile",  icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function StudentSidebar() {
  const path = usePathname();
  const { user, loading } = useSession();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 border-r border-surface-border bg-surface-card flex flex-col">
      <div className="h-16 flex items-center px-5 border-b border-surface-border">
        <span className="font-display font-bold text-xl text-white">
          Tech<span className="text-gradient">C</span>
        </span>
      </div>

      <div className="px-3 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-muted">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[--text-muted]" />
          ) : (
            <>
              <div className="w-7 h-7 rounded-full bg-brand-500/30 flex items-center justify-center text-brand-300 font-bold text-xs shrink-0">
                {user?.name?.[0] ?? "S"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[--text] truncate">{user?.name ?? "Student"}</p>
                <p className="text-[10px] text-[--text-muted] truncate">{user?.careerPath?.replace(/_/g, " ") ?? "No path set"}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`nav-item ${path === href || path.startsWith(href + "/") ? "active" : ""}`}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-surface-border space-y-0.5">
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`nav-item ${path === href ? "active" : ""}`}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
        <button onClick={handleLogout}
          className="nav-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>

      {user?.username && (
        <div className="p-3 border-t border-surface-border">
          <a href={`/u/${user.username}`} target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 hover:bg-brand-500/20 transition-colors">
            <span className="flex-1 truncate">techc.app/u/{user.username}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      )}
    </aside>
  );
}
