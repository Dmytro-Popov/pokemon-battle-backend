import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import {
  type AccessClaimsType,
  accessClaimsSchema,
} from "../schemas/accessClaimsSchema";

export const requireAccessToken: RequestHandler = (req, res, next) => {
  const token = req.get("Authorization")?.match(/^Bearer +(\S+)$/i)?.[1];
  if (!token) {
    return res.status(401).json({ message: "Access token is required." });
  }
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ["HS256"],
      issuer: "pokemon-battle-auth",
      audience: "pokemon-battle-api",
    });
  } catch (error) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? "Access token has expired."
        : "Access token is invalid.";
   return res.status(401).json({ message });
  }

  const claims = accessClaimsSchema.safeParse(decoded);

  if (!claims.success) {
    return res.status(401).json({ message: "Access token is invalid." });
  }
  req.user = { id: claims.data.sub, username: claims.data.username };
  next();
};
