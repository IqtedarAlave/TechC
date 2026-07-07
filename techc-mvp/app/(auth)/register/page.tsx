"use client";
import Link from "next/link";
import { GraduationCap, Building2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Join TechC</h1>
        <p className="text-[--text-muted] mt-1 text-sm">Who are you signing up as?</p>
      </div>

      <div className="space-y-4">
        <Link href="/register/student" className="card-hover flex items-center gap-5 group cursor-pointer block">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white mb-0.5">Student</p>
            <p className="text-sm text-[--text-muted]">CSE or EEE undergrad · Free forever</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[--text-muted] group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link href="/register/employer" className="card-hover flex items-center gap-5 group cursor-pointer block">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white mb-0.5">Employer / Company</p>
            <p className="text-sm text-[--text-muted]">Post jobs · Access verified talent</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[--text-muted] group-hover:text-accent-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      <p className="text-center text-sm text-[--text-muted] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
      </p>
    </div>
  );
}
