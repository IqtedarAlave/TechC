// Assessment runs in isolation — no sidebar, no app chrome
export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#0f1117] min-h-screen">{children}</div>;
}
