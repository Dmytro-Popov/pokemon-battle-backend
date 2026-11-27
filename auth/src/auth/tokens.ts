import type { Types} from "mongoose"
import type { CookieOptions, Response } from "express";
import jwt  from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import { RefreshToken } from "#models";

const ACCESS_TOKEN_SECONDS = 15 * 60;
const REFRESH_TOKEN_MS = 30 * 24 * 60 * 60 * 1000;

export const REFRESH_COOKIE = "refreshToken";

const isProd = process.env.NODE_ENV === "production";

export function hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
}

export const createToken = async (user: {_id: Types.ObjectId, username: string}) => {
  const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET!, {
    subject: user._id.toHexString(),
    expiresIn: ACCESS_TOKEN_SECONDS,
    algorithm: "HS256",
    issuer: "pokemon-battle-auth",
    audience: "pokemon-battle-api",
  });

  const refreshToken = randomBytes(32).toString("hex")

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS)
  })

  return { accessToken, refreshToken };
};

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/auth',
  maxAge: REFRESH_TOKEN_MS
}

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_COOKIE, token, refreshCookieOptions)
}

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE, refreshCookieOptions)
}

