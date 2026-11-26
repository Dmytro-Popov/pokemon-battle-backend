import bcrypt from "bcrypt";
import { AuthError } from "#errors";
import { User } from "#models";
import type { CredentialType, LoginType } from "#schemas";
import type { RequestHandler } from "express";
import { mongo } from "mongoose";
import { createToken } from "#auth";

type TokenResponse = { accessToken: string };

export const register: RequestHandler<
  unknown,
  TokenResponse,
  CredentialType
> = async (req, res) => {
  const { email, password } = req.body;

  if (await User.exists({ email })) {
    throw new AuthError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash }).catch(
    (error: unknown) => {
      if (error instanceof mongo.MongoServerError && error.code === 11000) {
        throw new AuthError(409, "An account with this email already exists.");
      }

      throw error;
    },
  );

  const { accessToken } = await createToken(user._id);

  res.status(201).json({ accessToken });
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

  const { accessToken } = await createToken(user._id);
  res.json({ accessToken });
};
