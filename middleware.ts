import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes and required roles
const PROTECTED: Record<string, string> = {
  "/dashboard":          "STUDENT",
  "/roadmap":            "STUDENT",
  "/projects":           "STUDENT",
  "/badges":             "STUDENT",
  "/jobs":               "STUDENT",
  "/profile":            "STUDENT",
  "/employer/dashboard": "EMPLOYER",
  "/employer/post-job":  "EMPLOYER",
  "/employer/students":  "EMPLOYER",
  "/employer/jobs":      "EMPLOYER",
  "/admin/dashboard":    "ADMIN",
  "/admin/users":        "ADMIN",
  "/admin/companies":    "ADMIN",
  "/admin/submissions":  "ADMIN",
  "/admin/badges":       "ADMIN",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Find matching protected prefix
  const requiredRole = Object.keys(PROTECTED).find((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (!requiredRole) return NextResponse.next();

  const token = req.cookies.get("tc_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (payload.role !== PROTECTED[requiredRole]) {
    // Wrong role — redirect to their own dashboard
    const redirects: Record<string, string> = {
      STUDENT:  "/dashboard",
      EMPLOYER: "/employer/dashboard",
      ADMIN:    "/admin/dashboard",
    };
    return NextResponse.redirect(new URL(redirects[payload.role] ?? "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/roadmap/:path*",
    "/projects/:path*",
    "/badges/:path*",
    "/jobs/:path*",
    "/profile/:path*",
    "/employer/:path*",
    "/admin/:path*",
  ],
};
