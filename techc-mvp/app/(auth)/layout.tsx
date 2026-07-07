import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      {/* Minimal nav */}
      <nav className="h-16 border-b border-surface-border flex items-center px-6">
        <Link href="/" className="font-display font-bold text-xl text-white">
          Tech<span className="text-gradient">C</span>
        </Link>
      </nav>

      {/* Centered form area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
