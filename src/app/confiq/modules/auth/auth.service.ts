import AppError from "../../../ErrorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../../utils/jwt";
import { envVars } from "../../env";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const doesUserExist = await User.findOne({ email });
  if (!doesUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist");
  }

  const isPasswordMatched =  await bcryptjs.compare(
    password as string,
    doesUserExist.password as string
  );


  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const jwtPayload = {
    userId : doesUserExist._id,
    email : doesUserExist.email,
    role : doesUserExist.role
  }

  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
  

  return {
    accessToken
  }
};

export const authServices = {
  credentialsLogin,
};
