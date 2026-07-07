"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Award, Shield, Check, Trophy, X } from "lucide-react";
import { CAREER_PATH_LABELS } from "@/lib/utils";

interface Submission {
  id: string;
  badgeUid: string | null;
  status: string;
  autoCheckScore: number | null;
  aiReviewScore: number | null;
  project: {
    title: string;
    difficulty: string;
    roadmap: {
      path: string;
      title: string;
    };
  };
}

class ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "square" | "triangle";
  alpha: number;
  decay: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2 - 50;
    this.size = Math.random() * 8 + 6;

    const colors = [
      "#fbbf24", // gold
      "#f59e0b", // amber
      "#eab308", // yellow
      "#3b82f6", // blue
      "#a855f7", // purple
      "#ec4899", // pink
      "#10b981", // emerald
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 15 + 5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - Math.random() * 5;

    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
    
    const shapes: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];
    this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    this.alpha = 1;
    this.decay = Math.random() * 0.01 + 0.005;
  }

  update(gravity: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    if (this.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === "square") {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else if (this.shape === "triangle") {
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.lineTo(this.size / 2, this.size / 2);
      ctx.lineTo(-this.size / 2, this.size / 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

export function BadgeCelebration() {
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkBadges() {
      try {
        const res = await fetch("/api/submissions");
        if (!res.ok) return;
        const data = await res.json();
        const submissions: Submission[] = data.submissions || [];

        const approved = submissions.filter(
          (s) => s.status === "MENTOR_APPROVED" && s.badgeUid
        );

        if (approved.length === 0) return;

        const celebratedJson = localStorage.getItem("techc_celebrated_badges");
        const celebrated: string[] = celebratedJson ? JSON.parse(celebratedJson) : [];

        const newBadge = approved.find((s) => !celebrated.includes(s.badgeUid!));

        if (newBadge) {
          setActiveSubmission(newBadge);
        }
      } catch (err) {
        console.error("Failed to check badges for celebration:", err);
      }
    }

    checkBadges();
  }, [pathname]);

  useEffect(() => {
    if (!activeSubmission) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particlesCount = 150;
    particlesRef.current = Array.from({ length: particlesCount }, () => new ConfettiParticle(canvas.width, canvas.height));

    const gravity = 0.25;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update(gravity);
        p.draw(ctx);

        if (p.alpha <= 0 || p.y > canvas.height) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeSubmission]);

  const handleDismiss = () => {
    if (!activeSubmission || !activeSubmission.badgeUid) return;

    const celebratedJson = localStorage.getItem("techc_celebrated_badges");
    const celebrated: string[] = celebratedJson ? JSON.parse(celebratedJson) : [];
    
    if (!celebrated.includes(activeSubmission.badgeUid)) {
      celebrated.push(activeSubmission.badgeUid);
      localStorage.setItem("techc_celebrated_badges", JSON.stringify(celebrated));
    }

    setActiveSubmission(null);
  };

  const handleViewBadges = () => {
    handleDismiss();
    router.push("/badges");
  };

  if (!activeSubmission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={handleDismiss}
      />

      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-10" 
      />

      <div className="relative z-20 max-w-md w-full bg-[#151922] border border-amber-500/30 rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(245,158,11,0.15)] overflow-hidden scale-100 transition-all duration-300 flex flex-col items-center">
        <div className="absolute top-[-50px] w-[200px] h-[200px] bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-full blur-[60px] opacity-25 animate-pulse pointer-events-none" />

        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-24 h-24 mb-6 mt-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-ping opacity-75" />
          <div className="absolute -inset-2 rounded-full border border-yellow-500/20 animate-pulse" />
          
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(245,158,11,0.4)] transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <div className="transform -rotate-12 hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-[#111622]" />
            </div>
          </div>
        </div>

        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-amber-400 mb-1">
          New Achievement Unlocked!
        </h2>
        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 mb-3 filter drop-shadow">
          Congratulations! 🎉
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          You have earned a verified mentor badge for your project <strong className="text-white font-semibold">{activeSubmission.project.title}</strong> on the <span className="text-brand-400 font-semibold">{CAREER_PATH_LABELS[activeSubmission.project.roadmap.path] || activeSubmission.project.roadmap.title}</span> path.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full mb-6 bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Auto Check</p>
            <p className="text-lg font-bold text-brand-300">{activeSubmission.autoCheckScore ?? "—"}<span className="text-xs font-normal text-slate-400">/100</span></p>
          </div>
          <div className="text-center border-l border-slate-700/50">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">AI Review</p>
            <p className="text-lg font-bold text-purple-300">{activeSubmission.aiReviewScore ?? "—"}<span className="text-xs font-normal text-slate-400">/100</span></p>
          </div>
        </div>

        <div className="w-full bg-[#0d1017] border border-slate-800/80 rounded-xl px-4 py-2.5 flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 overflow-hidden">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-mono text-amber-300 truncate">
              {activeSubmission.badgeUid}
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium shrink-0 flex items-center gap-0.5">
            <Check className="w-2.5 h-2.5" /> VERIFIED
          </span>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          <button 
            onClick={handleViewBadges}
            className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(59,110,240,0.3)] animate-pulse"
          >
            <Award className="w-4 h-4" />
            View My Badges
          </button>
          <button 
            onClick={handleDismiss}
            className="w-full btn-secondary py-3 rounded-xl"
          >
            Awesome, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
