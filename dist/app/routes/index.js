"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../confiq/modules/user/user.routes");
const auth_routes_1 = require("../confiq/modules/auth/auth.routes");
const divisions_routes_1 = require("../confiq/modules/divisions/divisions.routes");
const tour_routes_1 = require("../confiq/modules/tour/tour.routes");
const booking_route_1 = require("../confiq/modules/bookings/booking.route");
const payment_routes_1 = require("../confiq/modules/Payments/payment.routes");
const otp_routes_1 = require("../confiq/modules/otp/otp.routes");
const stats_routes_1 = require("../confiq/modules/stats/stats.routes");
exports.router = (0, express_1.Router)();
const moduleRoute = [
    {
        path: "/user",
        route: user_routes_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes
    },
    {
        path: "/division",
        route: divisions_routes_1.divisionRoutes
    },
    {
        path: "/tour",
        route: tour_routes_1.tourRoutes
    },
    {
        path: "/booking",
        route: booking_route_1.bookingRoutes
    },
    {
        path: "/payment",
        route: payment_routes_1.paymentRoutes
    },
    {
        path: "/otp",
        route: otp_routes_1.otpRoutes
    },
    {
        path: "/stats",
        route: stats_routes_1.StatsRoutes
    },
];
moduleRoute.forEach((route) => {
    exports.router.use(route.path, route.route);
});
