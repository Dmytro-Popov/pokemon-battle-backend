import { Router } from "express"
import { login, logout, me, refresh, register } from "#controllers";
import { requireAccessToken, validateBody } from "#middleware";
import { credentialSchema, loginSchema } from "#schemas";

export const authRoutes = Router()

authRoutes.post("/register", validateBody(credentialSchema), register)
authRoutes.post("/login", validateBody(loginSchema), login);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", logout);
authRoutes.get("/me", requireAccessToken, me);