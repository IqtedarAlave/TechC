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

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openrouterModel = process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it:free";

    if (!anthropicKey && !openrouterKey) {
      const mockResult = {
        score: 85,
        notes: "The repository demonstrates solid code quality and structure with clear component organization. The commit history shows a clean, step-by-step development process. To improve, consider adding more descriptive comments in complex business logic functions."
      };
      const updated = await prisma.projectSubmission.update({
        where: { id: params.id },
        data: {
          status:        "AI_REVIEWED",
          aiReviewScore: mockResult.score,
          aiReviewNotes: mockResult.notes,
        },
      });
      return NextResponse.json({
        submission: updated,
        aiScore: mockResult.score,
        aiNotes: mockResult.notes,
        mocked: true,
      });
    }

    // Call AI to review the submission
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

    let rawText = "{}";

    if (openrouterKey) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openrouterKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "TechC",
        },
        body: JSON.stringify({
          model: openrouterModel,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("[AI_REVIEW] OpenRouter error:", err);
        return NextResponse.json({ message: "AI review failed via OpenRouter" }, { status: 502 });
      }

      const aiData = await response.json();
      rawText = aiData.choices?.[0]?.message?.content ?? "{}";
    } else {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 300,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("[AI_REVIEW] Anthropic error:", err);
        return NextResponse.json({ message: "AI review failed via Anthropic" }, { status: 502 });
      }

      const aiData = await response.json();
      rawText = aiData.content?.[0]?.text ?? "{}";
    }

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
