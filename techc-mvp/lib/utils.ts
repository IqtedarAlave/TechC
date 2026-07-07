import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a short random UID for badges e.g. tc_a3f9d2b1e7 */
export function generateBadgeUid(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let uid = "tc_";
  for (let i = 0; i < 10; i++) {
    uid += chars[Math.floor(Math.random() * chars.length)];
  }
  return uid;
}

/** Format BDT currency */
export function formatBDT(amount: number): string {
  return new Intl.NumberFormat("en-BD").format(amount) + " BDT";
}

/** Relative time — e.g. "2h ago" */
export function relativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "just now";
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return d.toLocaleDateString("en-BD", { day: "numeric", month: "short" });
}

/** Truncate long strings */
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Career path enum → human label */
export const CAREER_PATH_LABELS: Record<string, string> = {
  WEB_DEV:          "Web Development",
  AI_ML:            "AI / Machine Learning",
  CYBERSECURITY:    "Cybersecurity",
  EMBEDDED_SYSTEMS: "Embedded Systems",
  DATA_SCIENCE:     "Data Science",
  UI_UX:            "UI / UX Design",
  DEVOPS:           "DevOps / Cloud",
};

/** Submission status → display config */
export const SUBMISSION_STATUS: Record<string, { label: string; badge: string; desc: string }> = {
  PENDING:          { label: "Pending",          badge: "badge-muted",  desc: "Queued for automated check" },
  AUTO_CHECKED:     { label: "Auto checked",     badge: "badge-blue",   desc: "Passed automated check. Queued for AI review." },
  AI_REVIEWED:      { label: "AI reviewed",      badge: "badge-yellow", desc: "AI review complete. Awaiting mentor." },
  MENTOR_APPROVED:  { label: "✓ Verified",       badge: "badge-green",  desc: "Mentor approved. Badge issued." },
  REJECTED:         { label: "Rejected",          badge: "badge-red",    desc: "Submission rejected. See mentor notes." },
};

/** Get initials from name */
export function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

/** Sleep helper for dev/testing */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
