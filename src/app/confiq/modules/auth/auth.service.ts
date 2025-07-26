/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../../ErrorHelpers/appError";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  
} from "../../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../env";


const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken.accessToken,
  };
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
 

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  const matchpassword = await bcryptjs.compare(
    oldPassword,

    user?.password as string
  );
  if (!matchpassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password does not match");
  }

  const hashedPassword = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND) || 10
  );

  user!.password = hashedPassword;
  await user!.save();

  return true;
};

export const authServices = {
  
  getNewAccessToken,
  resetPassword,
};
