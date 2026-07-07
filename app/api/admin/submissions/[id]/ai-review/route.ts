import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/**
 * POST /api/admin/submissions/[id]/ai-review
 *
 * Triggers an AI review of the submission using Anthropic API.
 * Stores score + notes in the DB and advances status to AI_REVIEWED.
 *
 * Requires ANTHROPIC_API_KEY in environment.
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
      include: { project: { include: { roadmap: true } } },
    });

    if (!submission) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (submission.status !== "AUTO_CHECKED") {
      return NextResponse.json(
        { message: "Submission must pass automated check first" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Call Claude to review the submission
    const prompt = `You are a senior software engineer reviewing a student project submission for TechC, a career platform for Bangladeshi CS/EE students.

Project: "${submission.project.title}"
Career path: ${submission.project.roadmap.title}
Difficulty: ${submission.project.difficulty}
GitHub URL: ${submission.githubUrl}
${submission.description ? `Student description: ${submission.description}` : ""}

Review criteria:
1. Code quality and structure (does it look hand-written or copy-pasted?)
2. Adherence to project requirements
3. README clarity and completeness
4. Evidence of genuine learning (commit history patterns, code progression)
5. Best practices for the tech stack

Respond ONLY with a JSON object, no markdown, no explanation:
{
  "score": <integer 0-100>,
  "notes": "<2-3 sentences of specific, actionable feedback mentioning what was done well and what could be improved>"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[AI_REVIEW] Anthropic error:", err);
      return NextResponse.json({ message: "AI review failed" }, { status: 502 });
    }

    const aiData = await response.json();
    const rawText = aiData.content?.[0]?.text ?? "{}";

    let parsed: { score: number; notes: string };
    try {
      parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch {
      parsed = { score: 70, notes: "AI review completed. Manual mentor review recommended." };
    }

    const updated = await prisma.projectSubmission.update({
      where: { id: params.id },
      data: {
        status:        "AI_REVIEWED",
        aiReviewScore: Math.min(100, Math.max(0, parsed.score)),
        aiReviewNotes: parsed.notes,
      },
    });

    return NextResponse.json({
      submission: updated,
      aiScore: parsed.score,
      aiNotes: parsed.notes,
    });
  } catch (err) {
    console.error("[AI_REVIEW]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
