import bcrypt from "bcrypt";
import { AuthError, NotFoundError } from "#errors";
import { User, RefreshToken } from "#models";
import type { CredentialType, LoginType } from "#schemas";
import type { RequestHandler } from "express";
import { mongo } from "mongoose";
import { createToken, hashRefreshToken,  REFRESH_COOKIE, setRefreshCookie, clearRefreshCookie} from "#auth";

type TokenResponse = { accessToken: string; username: string };

export const register: RequestHandler<
  unknown,
  TokenResponse,
  CredentialType
> = async (req, res) => {
  const { email, password, username } = req.body;

  if (await User.exists({ email })) {
    throw new AuthError(409, "An account with this email already exists.");
  }
  if (await User.exists({ username })) {
    throw new AuthError(409, "This username is already taken.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, username }).catch(
    (error: unknown) => {
      if (error instanceof mongo.MongoServerError && error.code === 11000) {
        throw new AuthError(
          409,
          error.keyPattern?.username
            ? "This username is already taken."
            : "An account with this email already exists.",
        );
      }

      throw error;
    },
  );

  const { accessToken, refreshToken } = await createToken(user);

  setRefreshCookie(res, refreshToken);

  res.status(201).json({ accessToken, username: user.username});
};

export const login: RequestHandler<unknown, TokenResponse, LoginType> = async (
  req,
  res,
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AuthError(401, "Email or password is invalid.");
  }

  const { accessToken, refreshToken } = await createToken(user);
  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, username: user.username });
};

export const refresh: RequestHandler<unknown, TokenResponse> =
  async (req, res) => {
    const token: unknown = req.cookies?.[REFRESH_COOKIE]
    if (typeof token !== "string" || !token) {
       throw new AuthError(401, "Refresh token is missing.");
    }

    const stored = await RefreshToken.findOneAndDelete({
      tokenHash: hashRefreshToken(token),
       expiresAt: { $gt: new Date() },
    })

    if (!stored) {
        throw new AuthError(401, "Refresh token is missing.");
    }

    const user = await User.findById(stored.userId).select("username")
    if (!user) {
    clearRefreshCookie(res);
    throw new AuthError(401, "Refresh token is invalid or expired.");
  }

   const { accessToken, refreshToken } = await createToken(user);
  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, username: user.username });
  }

export const me: RequestHandler = async (req, res) => { 
    if (!req.user) { 
        throw new AuthError(401, "Authentication required.");
    }

    const user = await User.findById(req.user.id).select("email username")

    if (!user) throw new NotFoundError("User");

    res.json({
        id: user._id.toHexString(),
        email: user.email, 
        username: user.username
    })
}

export const logout: RequestHandler = async (req, res) => {
  const token: unknown = req.cookies?.[REFRESH_COOKIE];
  if (typeof token === "string" && token) {
    await RefreshToken.deleteOne({ tokenHash: hashRefreshToken(token) });
  }
  clearRefreshCookie(res);
  res.status(204).end();
};