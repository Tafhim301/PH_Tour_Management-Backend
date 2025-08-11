/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { TourServices } from "./tour.service";

const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourServices.createTourType(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Tour Type Created Successfully",
      data: tourType,
    });
  }
);

const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tourType = await TourServices.updateTourType(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour Type updated Successfully",
      data: tourType,
    });
  }
);
const getSingleTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const tourTypes = await TourServices.getSingleTourType(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour Type retrieved Successfully",
      data: tourTypes,
    });
  }
);
const getTourTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await TourServices.getTourTypes();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour Type retrieved Successfully",
      data: tourTypes,
    });
  }
);
const deleteTourTypes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await TourServices.deleteTourType(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour Type deleted Successfully",
      data: null,
    });
  }
);

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourServices.createTour(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Tour Type Created Successfully",
      data: tourType,
    });
  }
);

const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
  
    const tour = await TourServices.getTour(query as Record<string, string>);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tours retrieved Successfully",
      meta : tour.meta,
      data: tour.data,
    });
  }
);

const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const body = req.body;
    const tour = await TourServices.updateTour(id, body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour updated Successfully",
      data: tour,
    });
  }
);

const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await TourServices.deleteTour(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour deleted Successfully",
      data: null,
    });
  }
);

export const tourControllers = {
  createTourType,
  getTourTypes,
  updateTourType,
  deleteTourTypes,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
