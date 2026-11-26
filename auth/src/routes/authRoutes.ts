import { Router } from "express"
import { login, register } from "#controllers";
import { validateBody } from "#middleware";
import { credentialSchema, loginSchema } from "#schemas";

export const authRoutes = Router()

authRoutes.post("/register", validateBody(credentialSchema), register)
authRoutes.post("/login", validateBody(loginSchema), login);