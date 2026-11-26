import { Router } from "express"
import { register } from "#controllers";
import { validateBody } from "#middleware";
import { credentialSchema } from "#schemas";

export const authRoutes = Router()

authRoutes.post("/register", validateBody(credentialSchema), register)
authRoutes.post("/login", () => { })