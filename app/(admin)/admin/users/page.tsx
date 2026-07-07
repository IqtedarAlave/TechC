"use client";
import { useState } from "react";
import { Search, Shield, Building2, GraduationCap, MoreVertical, CheckCircle, XCircle } from "lucide-react";

const USERS = [
  { id: "1", name: "Rafi Islam", email: "rafi@buet.ac.bd", role: "STUDENT", university: "BUET", path: "Web Dev", badges: 1, joined: "Jun 1" },
  { id: "2", name: "Tasnim Akter", email: "tasnim@nsu.edu.bd", role: "STUDENT", university: "NSU", path: "AI/ML", badges: 0, joined: "Jun 3" },
  { id: "3", name: "Mehedi Hassan", email: "mehedi@brac.net", role: "STUDENT", university: "BRAC", path: "Web Dev", badges: 0, joined: "Jun 5" },
  { id: "4", name: "Sumaiya Khatun", email: "sumaiya@sust.edu", role: "STUDENT", university: "SUST", path: "DevOps", badges: 2, joined: "Jun 6" },
  { id: "5", name: "HR — Acme Tech", email: "hr@acmetech.bd", role: "EMPLOYER", university: "—", path: "—", badges: null, joined: "Jun 8" },
  { id: "6", name: "Iqtedar Hossain", email: "iqtedar@techc.app", role: "ADMIN", university: "BUET", path: "—", badges: null, joined: "Jun 1" },
];

const ROLE_BADGE: Record<string, string> = {
  STUDENT: "badge-blue",
  EMPLOYER: "badge-yellow",
  ADMIN: "badge-red",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filtered = USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">All Users</h1>
        <p className="text-[--text-muted] text-sm mt-1">{USERS.length} total accounts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
          <input className="input pl-9" placeholder="Search by name or email…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["ALL", "STUDENT", "EMPLOYER", "ADMIN"].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all
                ${roleFilter === r
                  ? "bg-brand-500/10 border-brand-500/30 text-brand-300"
                  : "border-surface-border text-[--text-muted] hover:border-surface-muted"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              {["User", "Role", "University / Path", "Badges", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-[--text-muted] px-5 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}
                className={`border-b border-surface-border/50 hover:bg-surface-muted/30 transition-colors
                  ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-300 font-bold text-xs shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[--text]">{u.name}</p>
                      <p className="text-xs text-[--text-muted]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`${ROLE_BADGE[u.role]} flex items-center gap-1 w-fit`}>
                    {u.role === "STUDENT" && <GraduationCap className="w-3 h-3" />}
                    {u.role === "EMPLOYER" && <Building2 className="w-3 h-3" />}
                    {u.role === "ADMIN" && <Shield className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-[--text]">{u.university}</p>
                  <p className="text-xs text-[--text-muted]">{u.path}</p>
                </td>
                <td className="px-5 py-3.5">
                  {u.badges !== null ? (
                    <span className={u.badges > 0 ? "badge-green" : "badge-muted"}>
                      {u.badges} badge{u.badges !== 1 ? "s" : ""}
                    </span>
                  ) : <span className="text-[--text-muted]">—</span>}
                </td>
                <td className="px-5 py-3.5 text-xs text-[--text-muted]">{u.joined}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded-lg hover:bg-surface-muted flex items-center justify-center text-[--text-muted] hover:text-[--text] transition-colors">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[--text-muted] text-sm">No users match your search.</div>
        )}
      </div>
    </div>
  );
}
