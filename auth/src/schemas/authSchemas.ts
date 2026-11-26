import { z } from "zod";

const email = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .pipe(z.email());
const password = z
  .string({ error: "Password is required" })
  .min(8, { error: "Password must be at least 8 characters long." })
  .refine((value) => Buffer.byteLength(value, "utf-8") <= 72, {
    error: "Password must be at most 72 UTF-8 bytes long.",
  });
const username = z
  .string({ error: "Username is required" })
  .trim()
  .min(3, { error: "Username must be at least 3 characters long." })
  .max(20, { error: "Username must be at most 20 characters long." });



export const credentialSchema = z.strictObject({ email, password, username });
export const loginSchema = z.strictObject({
  email,
  password: z.string().min(1, { error: "Password is required." }),
});

export type CredentialType = z.infer<typeof credentialSchema>;
export type LoginType = z.infer<typeof loginSchema>;
