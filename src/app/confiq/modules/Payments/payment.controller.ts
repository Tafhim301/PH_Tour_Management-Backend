/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { envVars } from "../../env";
import { sendResponse } from "../../../utils/sendResponse";
import { SSLServiece } from "../sslCommerz/sslCommerz.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await paymentService.initPayment(bookingId as string)
    sendResponse(res, {
          success: true,
          statusCode: 201,
          message: "Payment done Successfully",
          data: result,
        });
});
const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await paymentService.successPayment(req.query as Record<string,string>)

    if(result.success){
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`)
    }
});
const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await paymentService.failPayment(req.query as Record<string,string>)

    if(!result.success){
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`)
    }
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
     const query = req.query
    const result = await paymentService.failPayment(req.query as Record<string,string>)

    if(!result.success){
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`)
    }
});


const getInvoiceDownloadUrl = catchAsync(
    async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        const result = await paymentService.getInvoiceDownloadUrl(paymentId);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Invoice download URL retrieved successfully",
            data: result,
        });
    }
);
const validatePayment = catchAsync(
    async (req: Request, res: Response) => {
        console.log("sslcommerz ipn url body", req.body);
        await SSLServiece.validatePayment(req.body)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Payment Validated Successfully",
            data: null,
        });
    }
);
export const paymentControllers = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceDownloadUrl,
  validatePayment
};
