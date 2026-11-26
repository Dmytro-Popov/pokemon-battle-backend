import type { Types} from "mongoose"
import jwt  from "jsonwebtoken";

export const createToken = async (user: {_id: Types.ObjectId, username: string}) => {
  const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET!, {
    subject: user._id.toHexString(),
    expiresIn: 60 * 60,
    algorithm: "HS256",
    issuer: "pokemon-battle-auth",
    audience: "pokemon-battle-api",
  });

  return { accessToken };
};