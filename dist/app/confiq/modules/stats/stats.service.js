"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const booking_model_1 = require("../bookings/booking.model");
const payment_interface_1 = require("../Payments/payment.interface");
const payment_model_1 = require("../Payments/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.isActive.ACTIVE,
    });
    const totalInActiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.isActive.INACTIVE,
    });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.isActive.BLOCKED,
    });
    const newUserInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUserInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const userByRolePromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUserInLast7Days, newUserInLast30Days, userByRole,] = yield Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUserInLast7DaysPromise,
        newUserInLast30DaysPromise,
        userByRolePromise,
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUserInLast7Days,
        newUserInLast30Days,
        userByRole,
    };
});
const getTourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTourPromise = tour_model_1.Tour.countDocuments();
    const totalTourByTourTypePromise = tour_model_1.Tour.aggregate([
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type",
            },
        },
        {
            $unwind: "$type",
        },
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalTourByDivisionPromise = tour_model_1.Tour.aggregate([
        {
            $lookup: {
                from: "divisions",
                localField: "divison",
                foreignField: "_id",
                as: "division",
            },
        },
        {
            $unwind: "$division",
        },
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalHighestBookedTourPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        {
            $sort: { bookingCount: -1 },
        },
        {
            $limit: 5,
        },
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] },
                        },
                    },
                ],
                as: "tour",
            },
        },
        {
            $unwind: "$tour",
        },
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const avgTourCostPromise = tour_model_1.Tour.aggregate([
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costFrom" },
            },
        },
    ]);
    const [totalTour, totalTourByTourType, avgTourCost, totalTourByDivision, totalHighestBookedTour,] = yield Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookedTourPromise,
    ]);
    return {
        totalTour,
        totalTourByTourType,
        avgTourCost,
        totalTourByDivision,
        totalHighestBookedTour,
    };
});
const getBookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookingPromise = booking_model_1.Booking.countDocuments();
    const totalBookingByStatusPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const bookingPerTourPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        {
            $sort: { bookingCount: -1 },
        },
        {
            $limit: 10,
        },
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour",
            },
        },
        {
            $unwind: "$tour",
        },
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const avgGuestCountPerBookingPromise = booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" },
            },
        },
    ]);
    const bookingLast7DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const bookingLast30DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalBookingByUniqueUsersPromise = booking_model_1.Booking.distinct("user").then((user) => user.length);
    const [totalBooking, totalBookingByStatus, bookingPerTour, avgGuestCountPerBooking, bookingLast7Days, bookingLast30Days, totalBookingByUniqueUsers,] = yield Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingLast7DaysPromise,
        bookingLast30DaysPromise,
        totalBookingByUniqueUsersPromise,
    ]);
    return {
        totalBooking,
        totalBookingByStatus,
        bookingPerTour,
        avgGuestCountPerBooking,
        bookingLast7Days,
        bookingLast30Days,
        totalBookingByUniqueUsers,
    };
});
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        //stage 1 group
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        {
            $match: { status: payment_interface_1.PAYMENT_STATUS.PAID }
        },
        {
            $group: {
                _id: null,
                totalReveneue: { $sum: '$amount' }
            }
        }
    ]);
    const avgPaymentAmountPromise = payment_model_1.Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: null,
                avgPaymentAMount: { $avg: "$amount" }
            }
        }
    ]);
    const paymentGatewayDataPromise = payment_model_1.Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = yield Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise
    ]);
    return { totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData };
});
exports.statsService = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats,
};
