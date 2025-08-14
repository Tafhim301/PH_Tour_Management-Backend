import { Router } from "express";
import { userRoutes } from "../confiq/modules/user/user.routes";
import { AuthRoutes } from "../confiq/modules/auth/auth.routes";
import { divisionRoutes } from "../confiq/modules/divisions/divisions.routes";
import { tourRoutes } from "../confiq/modules/tour/tour.routes";
import { bookingRoutes } from "../confiq/modules/bookings/booking.route";
import { paymentRoutes } from "../confiq/modules/Payments/payment.routes";
import { otpRoutes } from "../confiq/modules/otp/otp.routes";
import { StatsRoutes } from "../confiq/modules/stats/stats.routes";

export const router = Router();

const moduleRoute = [
    {
        path : "/user",
        route : userRoutes
    },
    {
        path : "/auth",
        route : AuthRoutes
    },
    {
        path : "/division",
        route : divisionRoutes
    },
    {
        path : "/tour",
        route : tourRoutes
    },
    {
        path : "/booking",
        route : bookingRoutes
    },
    {
        path : "/payment",
        route : paymentRoutes
    },
    {
        path : "/otp",
        route : otpRoutes
    },
    {
        path : "/stats",
        route : StatsRoutes
    },


]

moduleRoute.forEach((route) => {
    router.use(route.path,route.route)
})