/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { bookingServices } from "./booking.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const booking = await bookingServices.createBooking(
      req.body,
      decodedToken.userId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking Created Successfully",
      data: booking,
    });
  }
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const AllBookings = await bookingServices.getAllBookings();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Bookings retrieved Successfully",
      data: AllBookings,
    });
  }
);

const getBookingbyId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Booking = await bookingServices.getBookingbyId();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking Created Successfully",
      data: Booking,
    });
  }
);

const getUserBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userBookings = await bookingServices.getUserBookings();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking Created Successfully",
      data: userBookings,
    });
  }
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Booking = await bookingServices.updateBookingStatus();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking Created Successfully",
      data: Booking,
    });
  }
);

export const bookingController = {
  createBooking,
  getAllBookings,
  getBookingbyId,
  getUserBookings,
  updateBookingStatus,
};
