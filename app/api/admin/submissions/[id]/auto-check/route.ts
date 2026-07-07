import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/**
 * POST /api/admin/submissions/[id]/auto-check
 *
 * Layer 1: Automated checks on the GitHub repository.
 * Uses GitHub API to verify: repo exists, is public,
 * has README, has commits, and checks basic structure.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("tc_session")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const submission = await prisma.projectSubmission.findUnique({
      where: { id: params.id },
    });
    if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (submission.status !== "PENDING") {
      return NextResponse.json({ message: "Already checked" }, { status: 400 });
    }

    // Parse owner/repo from GitHub URL
    // e.g. https://github.com/username/repo-name
    const match = submission.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      await prisma.projectSubmission.update({
        where: { id: params.id },
        data: {
          status: "REJECTED",
          autoCheckScore: 0,
          autoCheckNotes: "Invalid GitHub URL — could not parse owner/repository.",
        },
      });
      return NextResponse.json({ passed: false, reason: "Invalid GitHub URL" });
    }

    const [, owner, repo] = match;
    const repoSlug = repo.replace(/\.git$/, "");
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "TechC-Platform",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const checks: { name: string; passed: boolean; points: number; note: string }[] = [];

    // Check 1 — Repo exists and is public
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoSlug}`, { headers });
    if (!repoRes.ok) {
      await prisma.projectSubmission.update({
        where: { id: params.id },
        data: {
          status: "REJECTED",
          autoCheckScore: 0,
          autoCheckNotes: "Repository not found or is private. Make the repository public and resubmit.",
        },
      });
      return NextResponse.json({ passed: false, reason: "Repository not found or private" });
    }
    const repoData = await repoRes.json();
    checks.push({
      name: "Repo exists and is public",
      passed: !repoData.private,
      points: 20,
      note: repoData.private ? "Repository must be public" : "Public repo confirmed",
    });

    // Check 2 — Has a README
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repoSlug}/readme`, { headers });
    checks.push({
      name: "Has README",
      passed: readmeRes.ok,
      points: 20,
      note: readmeRes.ok ? "README found" : "No README.md found — add one explaining your project",
    });

    // Check 3 — Has commits (at least 5)
    const commitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoSlug}/commits?per_page=10`,
      { headers }
    );
    const commits = commitsRes.ok ? await commitsRes.json() : [];
    const commitCount = Array.isArray(commits) ? commits.length : 0;
    checks.push({
      name: "Commit history",
      passed: commitCount >= 5,
      points: 20,
      note: commitCount >= 5
        ? `${commitCount}+ commits found — good development history`
        : `Only ${commitCount} commits. Projects should have ≥5 commits showing real development.`,
    });

    // Check 4 — Has code files (not just config)
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoSlug}/git/trees/HEAD?recursive=1`,
      { headers }
    );
    const tree = treeRes.ok ? await treeRes.json() : {};
    const files: string[] = (tree.tree || []).map((f: { path: string }) => f.path);
    const codeExtensions = [".js", ".ts", ".tsx", ".jsx", ".py", ".c", ".cpp", ".java", ".go"];
    const hasCode = files.some((f) => codeExtensions.some((ext) => f.endsWith(ext)));
    checks.push({
      name: "Contains code files",
      passed: hasCode,
      points: 20,
      note: hasCode ? "Code files found" : "No recognizable code files found",
    });

    // Check 5 — Updated recently (within 1 year)
    const lastPush = new Date(repoData.pushed_at || 0);
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const recentlyUpdated = lastPush > oneYearAgo;
    checks.push({
      name: "Recently updated",
      passed: recentlyUpdated,
      points: 20,
      note: recentlyUpdated
        ? `Last push: ${lastPush.toLocaleDateString()}`
        : "Repository has not been updated in over a year",
    });

    // Calculate score
    const score = checks.reduce((sum, c) => sum + (c.passed ? c.points : 0), 0);
    const allPassed = checks.every((c) => c.passed);
    const notes = checks.map((c) => `${c.passed ? "✓" : "✗"} ${c.name}: ${c.note}`).join("\n");

    await prisma.projectSubmission.update({
      where: { id: params.id },
      data: {
        status:         allPassed ? "AUTO_CHECKED" : (score >= 60 ? "AUTO_CHECKED" : "REJECTED"),
        autoCheckScore: score,
        autoCheckNotes: notes,
      },
    });

    return NextResponse.json({
      passed: score >= 60,
      score,
      checks,
      notes,
    });
  } catch (err) {
    console.error("[AUTO_CHECK]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
