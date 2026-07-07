import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-6">
      <div className="text-center animate-fade-up">
        <p className="text-8xl font-display font-bold text-gradient mb-4">404</p>
        <h1 className="text-2xl font-display font-bold text-white mb-2">Page not found</h1>
        <p className="text-[--text-muted] text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-flex">Go to homepage</Link>
      </div>
    </div>
  );
}
