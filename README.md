# TechC MVP 🇧🇩

**GitHub is the garage. TechC is the showroom.**

Career acceleration platform for CSE and EEE students in Bangladesh — helping students build verified, employer-ready portfolios from their project work.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/DB-PostgreSQL-336791)](https://www.postgresql.org/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)
[![License](https://img.shields.io/badge/license-Unlicensed-lightgrey)](#license)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Validation Pipeline](#validation-pipeline)
- [AI Review Layer](#ai-review-layer-layer-2)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Key Files](#key-files)
- [Contributing](#contributing)

---

## Overview

TechC MVP is a complete **Next.js 14** application with three role-based portals (student, employer, admin), a registration system, and a public portfolio layer. It's built to connect to a real database and deploy with minimal setup.

Every project a student submits passes through a three-layer validation pipeline — automated checks, AI review, and mentor approval — resulting in a publicly verifiable badge.

## Features

| Route | Audience | Status |
|---|---|---|
| `/` | Public | ✅ Landing page |
| `/login` | All users | ✅ |
| `/register` | All users | ✅ Role selector |
| `/register/student` | New students | ✅ 3-step form |
| `/register/employer` | New companies | ✅ |
| `/dashboard` | Students | ✅ Stats + roadmap preview |
| `/roadmap` | Students | ✅ Full path with lock/unlock |
| `/projects` | Students | ✅ Submit + validation tracking |
| `/portfolio` | Students | ✅ Job board |
| `/employer/dashboard` | Employers | ✅ |
| `/employer/post-job` | Employers | ✅ |
| `/admin/dashboard` | Admin | ✅ North star + quick actions |
| `/admin/users` | Admin | ✅ Searchable user table |
| `/admin/submissions` | Admin | ✅ Mentor review layer |
| `/u/[username]` | Public | ✅ Portfolio + badges |

## Tech Stack

| Layer | Tool | Cost |
|---|---|---|
| Frontend | Next.js 14 + Tailwind + TypeScript | Free |
| Database | PostgreSQL via Supabase | Free (500MB) |
| ORM | Prisma | Free |
| Auth | Custom JWT (jose) | Free |
| Hosting | Vercel | Free (hobby) |
| Email (later) | Resend | Free (3k/mo) |
| AI review | Anthropic API | ~$0.003/review |
| Payments | bKash / SSLCommerz | Per transaction |

**Total fixed cost to run MVP: ৳0/month**

## Project Structure

```
.
├── app/
│   ├── page.tsx                    # Public landing page
│   ├── (auth)/                     # Login + registration (no sidebar)
│   │   ├── login/
│   │   ├── register/               # Role selector
│   │   ├── register/student/       # 3-step student form
│   │   └── register/employer/      # Company form
│   │
│   ├── (student)/                  # Protected: STUDENT role only
│   │   ├── dashboard/
│   │   ├── roadmap/
│   │   ├── projects/               # Submit + track validations
│   │   └── portfolio/              # Job board
│   │
│   ├── (employer)/                 # Protected: EMPLOYER role only
│   │   ├── dashboard/
│   │   └── post-job/
│   │
│   ├── (admin)/                    # Protected: ADMIN role only
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── submissions/            # Mentor review layer
│   │
│   ├── u/[username]/               # Public portfolio pages
│   └── api/
│       └── auth/
│           ├── login/route.ts
│           ├── logout/route.ts
│           └── register/
│               ├── student/route.ts
│               └── employer/route.ts
│
├── components/
│   ├── student/StudentSidebar.tsx
│   ├── employer/EmployerSidebar.tsx
│   └── admin/AdminSidebar.tsx
│
├── lib/
│   ├── prisma.ts                   # Prisma singleton
│   └── auth.ts                     # JWT sign/verify
│
├── middleware.ts                   # Role-based route protection
├── prisma/schema.prisma            # Full DB schema
└── tailwind.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier)

### 1. Clone and install

```bash
git clone <your-repo>
cd techc-mvp
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Copy your **Database URL** (Settings → Database → URI)
3. Copy your **anon key** and **project URL**

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Minimum required in `.env.local`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="any-long-random-string"
```

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Push the database schema

```bash
npx prisma generate
npx prisma db push
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Schema

20+ tables organized into four areas:

| Area | Tables |
|---|---|
| Users | `User`, `StudentProfile`, `EmployerProfile` |
| Paths | `CareerRoadmap`, `RoadmapProject` |
| Validation | `ProjectSubmission` (all 3 layers in one table) |
| Jobs | `Job`, `JobApplication` |

**Key design decisions:**

- All three validation layers live in a single `ProjectSubmission` row — no joins needed to see a student's full status.
- `badgeUid` is the public verification token at `techc.app/verify/[uid]`.
- `isVerified` on `EmployerProfile` requires admin approval before an employer goes live.

## Validation Pipeline

Every submitted project moves through three layers:

```
Student submits GitHub URL
        │
        ▼
[Layer 1] Automated check
  • Repo exists and is public
  • Has a README
  • Has ≥5 commits
  • Code quality scan (future: GitHub API)
  • Stores: autoCheckScore, autoCheckNotes
        │
        ▼
[Layer 2] AI review (via Anthropic API)
  • Prompt: "Review this repo. Score originality, depth, best practices."
  • Stores: aiReviewScore, aiReviewNotes
        │
        ▼
[Layer 3] Mentor badge (admin, for now)
  • Admin visits /admin/submissions
  • Reads AI notes, reviews the repo, adds mentor notes
  • Clicks "Approve" → generates badgeUid → status = MENTOR_APPROVED
  • Publicly verifiable at techc.app/verify/[uid]
```

### Replacing mock data with real DB calls

Every dashboard currently uses hardcoded arrays. Replace with Prisma queries, for example:

```typescript
// Student dashboard — real submissions
const submissions = await prisma.projectSubmission.findMany({
  where: { student: { userId: session.userId } },
  include: { project: true },
  orderBy: { createdAt: "desc" },
  take: 5,
});

// Admin submissions — awaiting mentor review
const pending = await prisma.projectSubmission.findMany({
  where: { status: { in: ["AI_REVIEWED", "AUTO_CHECKED"] } },
  include: {
    student: { include: { user: true } },
    project: true,
  },
});
```

## AI Review Layer (Layer 2)

Install the SDK:

```bash
npm install @anthropic-ai/sdk
```

Create `app/api/submissions/ai-review/route.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

export async function POST(req: Request) {
  const { submissionId } = await req.json();

  const submission = await prisma.projectSubmission.findUnique({
    where: { id: submissionId },
    include: { project: true },
  });

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Review this student project submission for a "${submission.project.title}" project.
GitHub URL: ${submission.githubUrl}

Score from 0-100 and give brief feedback on:
1. Code quality and structure
2. README clarity
3. Problem-solving approach
4. Originality (not just a tutorial copy)

Respond in JSON: { "score": number, "notes": "string" }`,
    }],
  });

  const result = JSON.parse(message.content[0].text);

  await prisma.projectSubmission.update({
    where: { id: submissionId },
    data: {
      aiReviewScore: result.score,
      aiReviewNotes: result.notes,
      status: "AI_REVIEWED",
    },
  });

  return Response.json({ ok: true });
}
```

Add `ANTHROPIC_API_KEY` to your `.env.local`.

## Deployment

Deploy to [Vercel](https://vercel.com) (free tier):

```bash
npm i -g vercel
vercel
```

In the Vercel dashboard → **Settings → Environment Variables**, add:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL` — your live domain

Vercel handles the rest.

## Roadmap

### Phase 1 — Connect real data (this week)
- [ ] Replace mock arrays with Prisma queries in all pages
- [ ] Wire `/admin/submissions` approve button to update DB + generate `badgeUid`
- [ ] Make `/u/[username]` fetch from DB by username param
- [ ] Add session context so the sidebar shows real name and portfolio URL

### Phase 2 — Validation pipeline
- [ ] Layer 1: GitHub API call on submission to check repo exists + is public
- [ ] Layer 2: Call Anthropic API with repo README + file tree for AI review
- [ ] Layer 3: Already built — just wire the approve button

### Phase 3 — Jobs
- [ ] Employer post-job form → save to DB
- [ ] Student job board → filter by career path
- [ ] Apply button → create `JobApplication` row
- [ ] Employer dashboard → view applicants with portfolio links

### Phase 4 — Polish for launch
- [ ] Email notifications (Resend — free tier: 3,000/month)
- [ ] Profile edit page for students
- [ ] Badge public verify page at `/verify/[uid]`
- [ ] Admin badge management page

## Key Files

| File | What it does |
|---|---|
| `middleware.ts` | Blocks wrong-role access to every dashboard route |
| `lib/auth.ts` | JWT sign and verify — swap for NextAuth later if needed |
| `lib/prisma.ts` | Single DB connection — never import PrismaClient directly |
| `prisma/schema.prisma` | Source of truth for the DB — edit here, then `db push` |
| `app/globals.css` | All design tokens as CSS vars + utility classes |

## Contributing

This is an early-stage MVP. Issues and pull requests are welcome — please open an issue first to discuss significant changes.

---

<p align="center">Built in Bangladesh 🇧🇩 — TechC v0.1 MVP</p>
