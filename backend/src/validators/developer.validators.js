import { z } from "zod";

export const developerRegisterSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const developerLoginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").optional(),
  }),
});

export const updateOrganizationSchema = z.object({
  body: z.object({
    organization: z.string().optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal('')),
    bio: z.string().max(500, "Bio exceeds 500 characters").optional(),
  }),
});
