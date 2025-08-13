/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../../ErrorHelpers/appError";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from "../../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../env";
import { IAuthProviders, isActive } from "../user/user.interface";
import { sendEmail } from "../../../utils/sendmail";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken.accessToken,
  };
};
const resetPassword = async (
  
  newPassword: string,
  id : string,
  decodedToken: JwtPayload
) => {


  if (id !== decodedToken.userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You Cannot change your password");
  }

 

  const doesUserExist = await User.findById(decodedToken.userId)
  if(!doesUserExist){
    throw new AppError(401, "User does not exist")
  }

  
  const hashedPassword = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND) || 10
  );

  doesUserExist.password = hashedPassword;

  await doesUserExist.save()

 
};
const changePassword = async (
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
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  if (
    !user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set your password.Now you can change your password from your profile"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProviders = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProviders[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;

  user.auths = auths;

  await user.save();

  return true;
};
const forgotPassword = async (email: string) => {
  const doesUserExist = await User.findOne({ email: email });

  if (!doesUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (
    doesUserExist.isActive === isActive.BLOCKED ||
    doesUserExist.isActive === isActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${doesUserExist.isActive}`
    );
  }
  if (doesUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }
  if (!doesUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
  }

  const JwtPayload = {
    userId : doesUserExist._id,
    email : doesUserExist.email,
    role : doesUserExist.role

  }

  const resetToken = jwt.sign(JwtPayload,envVars.JWT_ACCESS_SECRET, {
    expiresIn : "10m"
  })

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${doesUserExist._id}&token=${resetToken}`

  sendEmail({
    to : doesUserExist.email,
    subject : "Password Reset",
    templateName : "ForgetPassword",
    templateData : {
      name : doesUserExist.name,
      resetUILink
    }

  })

  
};

export const authServices = {
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword
};
