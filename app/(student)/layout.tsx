import { StudentSidebar } from "@/components/student/StudentSidebar";
import { BadgeCelebration } from "@/components/student/BadgeCelebration";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
      <BadgeCelebration />
    </div>
  );
}
