/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.service";
import AppError from "../../../ErrorHelpers/appError";
import { setAuthCookie } from "../../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../../utils/userTokens";
import { envVars } from "../../env";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credentialsLogin(req.body);
   setAuthCookie(res,loginInfo)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged in successfully",
      data: loginInfo,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly : true,
      secure : false,
      sameSite : "lax"
    })
    res.clearCookie("refreshToken", {
      httpOnly : true,
      secure : false,
      sameSite : "lax"
    })

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged out successfully",
      data: null,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No refresh token found");
    }
    const tokenInfo = await authServices.getNewAccessToken(refreshToken as string) ;

   setAuthCookie(res,tokenInfo)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New token retrieved successfully",
      data: tokenInfo,
    });
  }
);
const resetPassowrd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const oldPassword =  req.body.oldPassword
    const newPassword =  req.body.newPassword;
    await authServices.resetPassword(oldPassword, newPassword, decodedToken)
 

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password changed successfully",
      data: null,
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : "" 
    if(redirectTo.startsWith('/')){
      redirectTo = redirectTo.slice(1)

    }
    
    const user = req.user;
    if(!user){
      throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    const tokenInfo = createUserTokens(user)

    setAuthCookie(res,tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)


 

  
  }
);


 

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassowrd,
  googleCallbackController
};
