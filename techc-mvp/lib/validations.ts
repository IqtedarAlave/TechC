import { z } from "zod";

// ── Auth ────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const PasswordSchema = z.object({
  current: z.string().min(1, "Current password required"),
  next:    z.string().min(8, "New password must be at least 8 characters"),
});

// ── Student registration ────────────────────────────────────────────
export const StudentRegisterSchema = z.object({
  name:           z.string().min(2, "Name must be at least 2 characters"),
  email:          z.string().email("Invalid email address"),
  password:       z.string().min(8, "Password must be at least 8 characters"),
  username:       z.string()
                    .min(3, "Username must be at least 3 characters")
                    .max(20, "Username max 20 characters")
                    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
  university:     z.string().min(2, "University is required"),
  department:     z.enum(["CSE", "EEE"]),
  graduationYear: z.coerce.number().min(2024).max(2032),
  careerPath:     z.enum(["WEB_DEV","AI_ML","CYBERSECURITY","EMBEDDED_SYSTEMS","DATA_SCIENCE","UI_UX","DEVOPS"]),
});

// ── Employer registration ───────────────────────────────────────────
export const EmployerRegisterSchema = z.object({
  name:        z.string().min(2),
  email:       z.string().email(),
  password:    z.string().min(8),
  companyName: z.string().min(2, "Company name is required"),
  website:     z.string().url().optional().or(z.literal("")),
  industry:    z.string().min(2),
  size:        z.string().min(1),
  location:    z.string().min(2),
  description: z.string().optional(),
});

// ── Student profile update ──────────────────────────────────────────
export const ProfileUpdateSchema = z.object({
  name:         z.string().min(2).optional(),
  bio:          z.string().max(200).optional(),
  githubUrl:    z.string().url().optional().or(z.literal("")),
  linkedinUrl:  z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  skills:       z.array(z.string().max(30)).max(12).optional(),
  isPublic:     z.boolean().optional(),
});

// ── Project submission ──────────────────────────────────────────────
export const SubmissionSchema = z.object({
  projectId:   z.string().cuid("Invalid project ID"),
  githubUrl:   z.string().url("Must be a valid GitHub URL")
                 .refine((u) => u.includes("github.com"), "Must be a GitHub repository URL"),
  description: z.string().max(500).optional(),
});

// ── Admin mentor review ─────────────────────────────────────────────
export const MentorReviewSchema = z.object({
  action:      z.enum(["approve", "reject"]),
  mentorNotes: z.string().min(10, "Please provide at least 10 characters of feedback"),
});

// ── Job post ────────────────────────────────────────────────────────
export const JobSchema = z.object({
  title:        z.string().min(3, "Job title is too short"),
  description:  z.string().min(20, "Job description is too short"),
  requirements: z.array(z.string()).default([]),
  careerPath:   z.enum(["WEB_DEV","AI_ML","CYBERSECURITY","EMBEDDED_SYSTEMS","DATA_SCIENCE","UI_UX","DEVOPS"]),
  jobType:      z.enum(["INTERNSHIP","FULL_TIME","PART_TIME","CONTRACT"]),
  salaryRange:  z.string().optional(),
  location:     z.string().min(2),
  deadline:     z.string().optional(),
});

// ── Job application ─────────────────────────────────────────────────
export const ApplicationSchema = z.object({
  coverNote: z.string().max(500).optional(),
});

// Type exports
export type StudentRegisterInput  = z.infer<typeof StudentRegisterSchema>;
export type EmployerRegisterInput = z.infer<typeof EmployerRegisterSchema>;
export type ProfileUpdateInput    = z.infer<typeof ProfileUpdateSchema>;
export type SubmissionInput       = z.infer<typeof SubmissionSchema>;
export type MentorReviewInput     = z.infer<typeof MentorReviewSchema>;
export type JobInput              = z.infer<typeof JobSchema>;
