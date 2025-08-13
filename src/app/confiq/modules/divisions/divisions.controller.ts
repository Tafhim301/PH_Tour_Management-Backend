/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { DivisionServices } from "./divisions.service";
import { IDIvision } from "./divisions.interface";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload : IDIvision = {
      ...req.body,
      thumbnail : req.file?.path
    }



    const division = await DivisionServices.createDivision(payload);



    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Division Created Successfully",
      data: division,
    });
  }
);
const getDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisions = await DivisionServices.getDivisions();


    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division retrieved Successfully",
      meta: divisions.meta,
      data: divisions.data,
    });
  }
);
const getSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const divisions = await DivisionServices.getSingleDivision(slug);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division retrieved Successfully",

      data: divisions.data,
    });
  }
);
const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ...req.body,
      thumbnail : req.file?.path
    }
    const id = req.params.id;
    
    const divisions = await DivisionServices.updateDivision(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division updated Successfully",
      data: divisions,
    });
  }
);
const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await DivisionServices.deleteDivision(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division deleted Successfully",
      data: null,
    });
  }
);

export const DivisionControllers = {
  createDivision,
  getDivisions,
  updateDivision,
  deleteDivision,
  getSingleDivision,
};
