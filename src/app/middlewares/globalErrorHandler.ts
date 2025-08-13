/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../confiq/env";
import AppError from "../ErrorHelpers/appError";
import { deleteImageFromCloudinary } from "../confiq/cloudinary.config";

export const globalErrorHandler = async(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
    if (req.file) {
        await deleteImageFromCloudinary(req.file.path)
    }

    if (req.files && Array.isArray(req.files) && req.files.length) {
        const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)

        await Promise.all(imageUrls.map(url => deleteImageFromCloudinary(url)))
    }
  let statusCode = 500;
  let message = `Something Went Wrong!! ${err.message}`
  if(err instanceof AppError){

    statusCode = err.statusCode;
    message = err.message;
  }else if(err instanceof Error){
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
