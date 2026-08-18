import { z } from "zod";

export const applicationSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company is required"),

  position: z
    .string()
    .trim()
    .min(1, "Position is required"),

  status: z.enum([
    "SAVED",
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "REJECTED"
  ]),

  appliedDate: z
    .string()
    .optional()
    .or(z.literal("")),

  notes: z
    .string()
    .optional()
});

export const updateApplicationSchema =
  applicationSchema.partial();