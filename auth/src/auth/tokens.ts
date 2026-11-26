import type { Types} from "mongoose"
import jwt  from "jsonwebtoken";

export const createToken = async (userId: Types.ObjectId) => {
  const accessToken = jwt.sign({}, process.env.JWT_SECRET!, {
    subject: userId.toHexString(),
    expiresIn: 60 * 60,
    algorithm: "HS256",
    issuer: "pokemon-battle-auth",
    audience: "pokemon-battle-api",
  });

  return { accessToken };
};