/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { statsService } from "./stats.service";

const getBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsService.getBookingStats()
  

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Booking Stats retrieved successfully",
      data: result,
    });
  }
);

const getPaymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
     
    const result = await statsService.getPaymentStats()

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment Stats retrieved successfully",
      data: result,
    });
  }
);
const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsService.getUserStats()

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User Stats Retrieved Successfully",
      data: result,
    });
  }
);
const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsService.getTourStats()

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Tour stats retrieved Successffully",
      data: result,
    });
  }
);



export const StatsController = {
    getBookingStats,
    getPaymentStats,
    getTourStats,
    getUserStats
}