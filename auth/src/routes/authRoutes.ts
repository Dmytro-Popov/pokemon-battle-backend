import { Router } from "express"
import { login, me, register } from "#controllers";
import { requireAccessToken, validateBody } from "#middleware";
import { credentialSchema, loginSchema } from "#schemas";

export const authRoutes = Router()

authRoutes.post("/register", validateBody(credentialSchema), register)
authRoutes.post("/login", validateBody(loginSchema), login);
authRoutes.get("/me", requireAccessToken, me);