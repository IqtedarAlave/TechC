import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: { default: "TechC", template: "%s | TechC" },
  description:
    "Career acceleration for CSE and EEE students in Bangladesh. Build real projects. Get verified. Land your first job.",
  keywords: ["TechC", "Bangladesh tech jobs", "CSE internship", "EEE career"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
