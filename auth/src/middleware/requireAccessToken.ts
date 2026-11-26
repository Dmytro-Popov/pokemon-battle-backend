import jwt from "jsonwebtoken";
import { AuthError } from "#errors";
import type { RequestHandler } from "express";
import { accessClaimsSchema } from "#schemas";



export const requireAccessToken: RequestHandler = (req, _res, next) => {
  const token = req.get("Authorization")?.match(/^Bearer +(\S+)$/i)?.[1];

  if (!token) {
    throw new AuthError(401, "Access token is required.");
  }

    let decoded: unknown
  try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!, {
        algorithms: ["HS256"],
        issuer: "pokemon-battle-auth",
        audience: "pokemon-battle-api",
      });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError(401, "Access token has expired.");
    }
    throw new AuthError(401, "Access token is invalid.");
  }

    const claims = accessClaimsSchema.safeParse(decoded)
    console.log(claims)

    if (!claims.success) throw new AuthError(401, "Access token is invalid.");

    req.user = { id: claims.data.sub, username: claims.data.username };
    next();
};
