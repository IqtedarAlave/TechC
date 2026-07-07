"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { AlertTriangle, Clock, Shield, CheckCircle, ChevronRight } from "lucide-react";

// --- Types ---
type Question = {
  id: string;
  text: string;
  options: string[];
  timeLimit: number; // seconds per question
};

type ViolationEvent = {
  type: "TAB_SWITCH" | "WINDOW_BLUR" | "FULLSCREEN_EXIT" | "COPY_ATTEMPT" | "RIGHT_CLICK";
  at: number; // epoch ms
};

// --- Mock questions (replace with API fetch) ---
const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    timeLimit: 60,
  },
  {
    id: "q2",
    text: "Which HTTP method is idempotent and safe?",
    options: ["POST", "DELETE", "GET", "PATCH"],
    timeLimit: 45,
  },
  {
    id: "q3",
    text: "In React, what hook is used to run side effects?",
    options: ["useState", "useRef", "useEffect", "useMemo"],
    timeLimit: 45,
  },
  {
    id: "q4",
    text: "What does SQL JOIN return by default (INNER JOIN)?",
    options: [
      "All rows from both tables",
      "Only matching rows from both tables",
      "All rows from left table",
      "All rows from right table",
    ],
    timeLimit: 60,
  },
  {
    id: "q5",
    text: "Which data structure uses LIFO order?",
    options: ["Queue", "Linked List", "Stack", "Tree"],
    timeLimit: 30,
  },
];

const MAX_VIOLATIONS = 3;

type Phase = "INTRO" | "EXAM" | "SUBMITTED" | "TERMINATED";

export default function AssessmentEngine() {
  const [phase, setPhase] = useState<Phase>("INTRO");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(QUESTIONS[0]?.timeLimit ?? 60);
  const [violations, setViolations] = useState<ViolationEvent[]>([]);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[][]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Shuffle options on mount
  useEffect(() => {
    const shuffled = QUESTIONS.map((q) =>
      [...q.options].sort(() => Math.random() - 0.5)
    );
    setShuffledOptions(shuffled);
  }, []);

  const recordViolation = useCallback((type: ViolationEvent["type"]) => {
    if (phase !== "EXAM") return;
    const v: ViolationEvent = { type, at: Date.now() };
    setViolations((prev) => {
      const next = [...prev, v];
      if (next.length >= MAX_VIOLATIONS) {
        setPhase("TERMINATED");
      } else {
        setShowViolationWarning(true);
        setTimeout(() => setShowViolationWarning(false), 3000);
      }
      return next;
    });
  }, [phase]);

  // Anti-cheat: tab switch
  useEffect(() => {
    if (phase !== "EXAM") return;
    const onVisibility = () => {
      if (document.hidden) recordViolation("TAB_SWITCH");
    };
    const onBlur = () => recordViolation("WINDOW_BLUR");
    const onContextMenu = (e: MouseEvent) => { e.preventDefault(); recordViolation("RIGHT_CLICK"); };
    const onCopy = (e: ClipboardEvent) => { e.preventDefault(); recordViolation("COPY_ATTEMPT"); };
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) recordViolation("FULLSCREEN_EXIT");
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopy);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [phase, recordViolation]);

  // Per-question countdown timer
  useEffect(() => {
    if (phase !== "EXAM") return;
    setTimeLeft(QUESTIONS[currentQ].timeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Auto-advance on timeout
          clearInterval(timerRef.current!);
          handleNext();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, phase]);

  function enterFullscreen() {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }

  function startExam() {
    enterFullscreen();
    startTimeRef.current = Date.now();
    setPhase("EXAM");
  }

  function handleAnswer(optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [QUESTIONS[currentQ].id]: optionIndex }));
  }

  function handleNext() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      submitExam();
    }
  }

  function submitExam() {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    setPhase("SUBMITTED");
  }

  const q = QUESTIONS[currentQ];
  const options = shuffledOptions[currentQ] ?? q?.options ?? [];
  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const timePct = (timeLeft / (q?.timeLimit ?? 60)) * 100;
  const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000);
  const score = QUESTIONS.filter((q, i) => answers[q.id] !== undefined).length;

  // ── INTRO ──
  if (phase === "INTRO") {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-6 animate-fade-up">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-brand-400" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">Proctored Assessment</h1>
            <p className="text-[--text-muted] text-sm">Web Development · Junior Track</p>
          </div>

          <div className="card space-y-3">
            <p className="text-sm font-medium text-[--text] mb-3">Before you start — read carefully</p>
            {[
              `${QUESTIONS.length} questions · each has its own time limit`,
              "The exam runs in fullscreen — exiting counts as a violation",
              "Switching tabs or windows counts as a violation",
              `${MAX_VIOLATIONS} violations will auto-terminate the exam`,
              "You cannot go back to previous questions",
              "Right-click and copy are disabled during the exam",
              "You have one attempt — this cannot be retaken",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[--text-muted]">
                <span className="text-brand-400 font-mono text-xs mt-0.5 shrink-0">{i + 1}.</span>
                {rule}
              </div>
            ))}
          </div>

          <button onClick={startExam} className="btn-primary w-full text-base py-3 flex items-center justify-center gap-2">
            Start exam <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-center text-xs text-[--text-muted]">
            The exam will enter fullscreen mode automatically.
          </p>
        </div>
      </div>
    );
  }

  // ── TERMINATED ──
  if (phase === "TERMINATED") {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-display font-bold text-white mb-2">Exam Terminated</h1>
          <p className="text-[--text-muted] text-sm mb-6">
            Your exam was automatically terminated after {MAX_VIOLATIONS} integrity violations.
            This attempt has been logged and cannot be retaken.
          </p>
          <div className="card text-left space-y-2 mb-6">
            <p className="text-xs font-medium text-red-400 mb-2">Violation log</p>
            {violations.map((v, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-[--text-muted]">{v.type.replace("_", " ")}</span>
                <span className="text-[--text-muted]">
                  {new Date(v.at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <a href="/dashboard" className="btn-secondary inline-flex">Back to dashboard</a>
        </div>
      </div>
    );
  }

  // ── SUBMITTED ──
  if (phase === "SUBMITTED") {
    const answered = Object.keys(answers).length;
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-accent-400" />
          </div>
          <h1 className="text-xl font-display font-bold text-white mb-2">Assessment Submitted</h1>
          <p className="text-[--text-muted] text-sm mb-6">
            Results will appear on your dashboard once reviewed.
          </p>
          <div className="card text-left space-y-3 mb-6">
            {[
              { label: "Questions answered", value: `${answered} / ${QUESTIONS.length}` },
              { label: "Violations", value: violations.length === 0 ? "None ✓" : `${violations.length}` },
              { label: "Total time", value: `${Math.floor(totalTime / 60)}m ${totalTime % 60}s` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-[--text-muted]">{label}</span>
                <span className="text-[--text] font-medium">{value}</span>
              </div>
            ))}
          </div>
          <a href="/dashboard" className="btn-primary inline-flex">Back to dashboard</a>
        </div>
      </div>
    );
  }

  // ── EXAM ──
  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col select-none">
      {/* Top bar */}
      <div className="h-14 border-b border-surface-border flex items-center px-6 gap-4">
        <span className="font-display font-bold text-white">Tech<span className="text-gradient">C</span></span>
        <span className="text-xs text-[--text-muted]">Web Dev · Junior</span>

        <div className="flex-1" />

        {/* Violations */}
        {violations.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            {violations.length}/{MAX_VIOLATIONS} warnings
          </div>
        )}

        {/* Timer */}
        <div className={`flex items-center gap-1.5 text-sm font-mono font-bold
          ${timePct < 25 ? "text-red-400" : timePct < 50 ? "text-yellow-400" : "text-[--text]"}`}>
          <Clock className="w-4 h-4" />
          {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
        </div>

        {/* Question counter */}
        <span className="text-xs text-[--text-muted]">
          {currentQ + 1} / {QUESTIONS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-surface-muted">
        <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Time bar */}
      <div className="h-0.5 bg-surface-muted">
        <div
          className={`h-full transition-all duration-1000 ${timePct < 25 ? "bg-red-500" : "bg-accent-500"}`}
          style={{ width: `${timePct}%` }}
        />
      </div>

      {/* Violation warning */}
      {showViolationWarning && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2.5 flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">
            Warning: Integrity violation detected ({violations.length}/{MAX_VIOLATIONS}).
            {MAX_VIOLATIONS - violations.length} remaining before termination.
          </p>
        </div>
      )}

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-6 animate-fade-up" key={currentQ}>
          <div>
            <p className="text-xs text-[--text-muted] uppercase tracking-wider mb-3">
              Question {currentQ + 1}
            </p>
            <h2 className="text-xl font-display font-semibold text-white leading-snug">
              {q.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {options.map((opt, i) => {
              const selected = answers[q.id] === i;
              return (
                <button key={i} onClick={() => handleAnswer(i)}
                  className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all
                    ${selected
                      ? "bg-brand-500/10 border-brand-500/50 text-brand-300"
                      : "border-surface-border text-[--text] hover:border-brand-500/30 hover:bg-surface-muted"}`}>
                  <span className="font-mono text-xs mr-3 text-[--text-muted]">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Next */}
          <div className="flex justify-end">
            <button onClick={handleNext}
              className="btn-primary flex items-center gap-2">
              {currentQ < QUESTIONS.length - 1 ? "Next question" : "Submit exam"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
