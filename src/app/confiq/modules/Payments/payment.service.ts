/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatusCode } from "axios";
import AppError from "../../../ErrorHelpers/appError";
import { BOOKING_STATUS } from "../bookings/booking.interface";
import { Booking } from "../bookings/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLServiece } from "../sslCommerz/sslCommerz.service";
import { generatePdf, IInvoiceData } from "../../../utils/invoice";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { Date } from "mongoose";
import { sendEmail } from "../../../utils/sendmail";
import { uploadBufferCloudinary } from "../../cloudinary.config";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      HttpStatusCode.NotFound,
      "Payment Not found. You have not booked this tour"
    );
  }

  const booking = await Booking.findById(payment.booking);

  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhoneNumber = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    name: userName,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLServiece.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },

      { session }
    );

    if (!updatedPayment) {
      throw new AppError(404, "Payment not found");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    )
      .populate("tour", "title")
      .populate("user", "name email");

    if (!updatedBooking) {
      throw new AppError(404, "Booking not found");
    }

    const invoieData: IInvoiceData = {
      bookingDate: updatedBooking.createdAt as Date,
      guestCount: updatedBooking.guestCount,
      totalAmount: updatedPayment.amount,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
      transactionId: updatedPayment.transactionId,
      userName: (updatedBooking.user as unknown as IUser).name,
    };

    const pdfBuffer = await generatePdf(invoieData);

    const cloudinaryResult = await uploadBufferCloudinary(pdfBuffer, "invoice");

    await Payment.findByIdAndUpdate(
      updatedPayment._id,
      { invoiceUrl: cloudinaryResult?.secure_url },
      { runValidators: true, session }
    );

    await sendEmail({
      to: (updatedBooking.user as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoieData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Payment Completed Successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAIL,
      },

      { session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment has been failed",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },

      { session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment has been Cancelled",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getInvoiceDownloadUrl = async (paymentId: string) => {
    const payment = await Payment.findById(paymentId)
        .select("invoiceUrl")

    if (!payment) {
        throw new AppError(401, "Payment not found")
    }

    if (!payment.invoiceUrl) {
        throw new AppError(401, "No invoice found")
    }

    return payment.invoiceUrl
};


export const paymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceDownloadUrl
};
