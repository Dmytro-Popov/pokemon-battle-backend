import { z } from "zod";

export const accessClaimsSchema = z.object({
  sub: z.string().regex(/^[a-f0-9]{24}$/i),
  username: z.string(),
  exp: z.number(),
});

export type AccessClaimsType = z.infer<typeof accessClaimsSchema>