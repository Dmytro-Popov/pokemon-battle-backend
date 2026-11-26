import { Router } from "express"
import { register } from "#controllers";

export const authRoutes = Router()

authRoutes.post("/register", register)
authRoutes.post("/login", () => { })