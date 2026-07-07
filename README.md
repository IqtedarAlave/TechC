# TechC MVP

> GitHub is the garage. TechC is the showroom.
> Career acceleration for CSE and EEE students in Bangladesh.

---

## What's in this repo

A complete Next.js 14 MVP with three portals, registration flows, and a public portfolio layer — ready to connect to a real database and deploy.

---

## Architecture at a glance

```
/
├── app/
│   ├── page.tsx                    ← Public landing page
│   ├── (auth)/                     ← Login + registration (no sidebar)
│   │   ├── login/
│   │   ├── register/               ← Role selector
│   │   ├── register/student/       ← 3-step student form
│   │   └── register/employer/      ← Company form
│   │
│   ├── (student)/                  ← Protected: STUDENT role only
│   │   ├── dashboard/
│   │   ├── roadmap/
│   │   ├── projects/               ← Submit + track validations
│   │   └── portfolio/              ← Job board
│   │
│   ├── (employer)/                 ← Protected: EMPLOYER role only
│   │   ├── dashboard/
│   │   └── post-job/
│   │
│   ├── (admin)/                    ← Protected: ADMIN role only
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── submissions/            ← Mentor review layer
│   │
│   ├── u/[username]/               ← Public portfolio pages
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
│   ├── prisma.ts                   ← Prisma singleton
│   └── auth.ts                     ← JWT sign/verify
│
├── middleware.ts                   ← Role-based route protection
├── prisma/schema.prisma            ← Full DB schema
└── tailwind.config.ts
```

---

## Pages complete

| Route | Who sees it | Status |
|---|---|---|
| `/` | Public | ✅ Landing page |
| `/login` | All | ✅ |
| `/register` | All | ✅ Role selector |
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

---

## Setup — do this once

### 1. Clone and install

```bash
git clone <your-repo>
cd techc-mvp
npm install
```

### 2. Set up Supabase (free tier)

1. Go to supabase.com → New project
2. Copy your **Database URL** (Settings → Database → URI)
3. Copy your **anon key** and **project URL**

### 3. Create `.env.local`

```bash
cp .env.example .env.local
# Then fill in your values
```

Minimum required:
```
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
# Open http://localhost:3000
```

---

## Deployment — Vercel (free)

```bash
npm i -g vercel
vercel
```

In Vercel dashboard → Settings → Environment Variables, add:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL` = your live domain

That's it. Vercel handles everything else.

---

## Database schema overview

20+ tables across these areas:

| Area | Tables |
|---|---|
| Users | `User`, `StudentProfile`, `EmployerProfile` |
| Paths | `CareerRoadmap`, `RoadmapProject` |
| Validation | `ProjectSubmission` (all 3 layers in one table) |
| Jobs | `Job`, `JobApplication` |

Key design decisions:
- All three validation layers live in **one `ProjectSubmission` row** — no joins needed to see a student's full status
- `badgeUid` is the public verification token at `techc.app/verify/[uid]`
- `isVerified` on `EmployerProfile` means you (admin) must approve before they go live

---

## The three validation layers — how they connect

```
Student submits GitHub URL
        ↓
[Layer 1] Automated check
  • Repo exists and is public
  • Has README
  • Has ≥5 commits
  • Code quality scan (future: GitHub API)
  • Stores: autoCheckScore, autoCheckNotes
        ↓
[Layer 2] AI review (via Anthropic API or OpenAI)
  • Prompt: "Review this repo. Score originality, depth, best practices."
  • Stores: aiReviewScore, aiReviewNotes
        ↓
[Layer 3] Mentor badge (you, the admin, for now)
  • Admin goes to /admin/submissions
  • Reads AI notes, reviews repo, writes mentor notes
  • Clicks "Approve" → generates badgeUid → status = MENTOR_APPROVED
  • Public: techc.app/verify/[uid]
```

---

## What mock data to replace with real DB calls

Every dashboard currently uses hardcoded arrays. Replace with Prisma queries like:

```typescript
// Student dashboard — real submissions
const submissions = await prisma.projectSubmission.findMany({
  where: { student: { userId: session.userId } },
  include: { project: true },
  orderBy: { createdAt: "desc" },
  take: 5,
});

// Admin submissions — awaiting mentor
const pending = await prisma.projectSubmission.findMany({
  where: { status: { in: ["AI_REVIEWED", "AUTO_CHECKED"] } },
  include: {
    student: { include: { user: true } },
    project: true,
  },
});
```

---

## What to build next (in order)

### Phase 1 — Connect real data (this week)
- [ ] Replace mock arrays with Prisma queries in all pages
- [ ] Wire `/admin/submissions` approve button to update DB + generate `badgeUid`
- [ ] Make `/u/[username]` fetch from DB by username param
- [ ] Add session context so sidebar shows real name and portfolio URL

### Phase 2 — Validation pipeline
- [ ] Layer 1: GitHub API call on submission to check repo exists + is public
- [ ] Layer 2: Call Anthropic API with repo README + file tree for AI review
- [ ] Layer 3: Already built — just wire the approve button

### Phase 3 — Jobs
- [ ] Employer post-job form → save to DB
- [ ] Student job board → filter by their career path
- [ ] Apply button → create `JobApplication` row
- [ ] Employer dashboard → see applicants with portfolio links

### Phase 4 — Polish for launch
- [ ] Email notifications (Resend — free tier: 3,000/month)
- [ ] Profile edit page for students
- [ ] Badge public verify page at `/verify/[uid]`
- [ ] Admin badge management page

---

## Adding the AI review layer (Layer 2)

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

---

## Key files to know

| File | What it does |
|---|---|
| `middleware.ts` | Blocks wrong-role access to every dashboard route |
| `lib/auth.ts` | JWT sign and verify — swap for NextAuth later if needed |
| `lib/prisma.ts` | Single DB connection — never import PrismaClient directly |
| `prisma/schema.prisma` | Source of truth for the DB — edit here, then `db push` |
| `app/globals.css` | All design tokens as CSS vars + utility classes |

---

## Stack

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

Total fixed cost to run MVP: **৳0/month**

---

*Built in Bangladesh 🇧🇩 — TechC v0.1 MVP*
#   T e c h C  
 