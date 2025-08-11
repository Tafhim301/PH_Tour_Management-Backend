import { Router } from "express";
import { userRoutes } from "../confiq/modules/user/user.routes";
import { AuthRoutes } from "../confiq/modules/auth/auth.routes";
import { divisionRoutes } from "../confiq/modules/divisions/divisions.routes";
import { tourRoutes } from "../confiq/modules/tour/tour.routes";
import { bookingRoutes } from "../confiq/modules/bookings/booking.route";

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


]

moduleRoute.forEach((route) => {
    router.use(route.path,route.route)
})