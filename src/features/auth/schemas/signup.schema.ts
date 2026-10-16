import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().trim().refine((value) => value.split(/\s+/).filter(Boolean).length >= 2, "Enter your first and last name"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(7, "Phone number must be at least 7 characters")
      .max(32, "Phone number is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string(),
    agreed: z.literal(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.agreed === true, {
    path: ["agreed"],
    message: "You must agree to the Terms of Service and Privacy Policy",
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first_name = parts.shift() ?? "";
  const last_name = parts.join(" ") || first_name;

  return { first_name, last_name };
}
