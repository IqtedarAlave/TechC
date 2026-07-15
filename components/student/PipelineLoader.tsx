"use client";

import { Cpu, FileCode, CheckCircle, Terminal, HelpCircle, ShieldAlert } from "lucide-react";

// ── Loader 1: Automated Check Running ──────────────────────────────────
export function AutoCheckLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-brand-500/5 border border-brand-500/20 text-center h-full min-h-[90px] relative overflow-hidden">
      {/* Small floating elements */}
      <div className="flex items-center gap-1.5 mb-2 text-brand-400">
        <Terminal className="w-4 h-4 animate-pipeline-float" />
        <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">Layer 1</span>
      </div>

      {/* Pulsing indicator */}
      <div className="text-sm font-semibold text-brand-300 mb-2 font-display flex items-center gap-1">
        Checking...
      </div>

      {/* Cute mini progress line */}
      <div className="w-16 h-1 bg-surface-muted rounded-full overflow-hidden relative">
        <div className="h-full bg-brand-400 rounded-full animate-pipeline-progress" />
      </div>

      <p className="text-[9px] text-[--text-muted] mt-2 leading-none">Scanning Repository</p>
    </div>
  );
}

// ── Loader 2: AI Scanning Code ──────────────────────────────────────────
export function AiReviewLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center h-full min-h-[90px] relative overflow-hidden">
      {/* Scanning Light bar */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pipeline-scan z-10" />
      
      <div className="flex items-center gap-1.5 mb-2 text-purple-400">
        <Cpu className="w-4 h-4 animate-pipeline-float" />
        <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">Layer 2</span>
      </div>

      <div className="text-sm font-semibold text-purple-300 mb-2 font-display">
        AI Reviewing...
      </div>

      {/* Small code pattern skeleton */}
      <div className="flex gap-0.5 justify-center opacity-60">
        <div className="w-2.5 h-1 bg-purple-500/30 rounded" />
        <div className="w-4 h-1 bg-purple-500/40 rounded animate-pulse" />
        <div className="w-2 h-1 bg-purple-500/30 rounded" />
      </div>

      <p className="text-[9px] text-[--text-muted] mt-2 leading-none">Analyzing originality</p>
    </div>
  );
}

// ── Loader 3: Pending Mentor Assignment ──────────────────────────────────
export function MentorLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-accent-500/5 border border-accent-500/20 text-center h-full min-h-[90px] relative overflow-hidden">
      <div className="flex items-center gap-1.5 mb-2 text-accent-400">
        <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
          {/* Custom clock outline */}
          <div className="w-3.5 h-3.5 rounded-full border-1.5 border-accent-400/80 flex items-center justify-center relative">
            {/* Clock hand rotating */}
            <div className="absolute top-[1.5px] bottom-1/2 left-[5px] w-[1px] bg-accent-400 origin-bottom animate-pipeline-clock" />
          </div>
        </div>
        <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">Layer 3</span>
      </div>

      <div className="text-sm font-semibold text-accent-300 mb-1.5 font-display">
        Awaiting Mentor
      </div>

      {/* Mini dots queue indication */}
      <div className="flex gap-1 justify-center pt-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-400/30 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-accent-400/50 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-accent-400/80 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>

      <p className="text-[9px] text-[--text-muted] mt-2 leading-none">Verification Queue</p>
    </div>
  );
}
