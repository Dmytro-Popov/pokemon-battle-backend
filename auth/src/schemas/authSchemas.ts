import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email());
const password = z
  .string()
  .min(8, { error: "Password must be at least 8 characters long." })
  .refine((value) => Buffer.byteLength(value, "utf-8") <= 72, {
    error: "Password must be at most 72 UTF-8 bytes long.",
  });

export const credentialSchema = z.strictObject({email, password})
export type CredentialType = z.infer<typeof credentialSchema>