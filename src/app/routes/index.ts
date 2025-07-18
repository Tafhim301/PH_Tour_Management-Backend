import { Router } from "express";
import { userRoutes } from "../confiq/modules/user/user.routes";
import { AuthRoutes } from "../confiq/modules/auth/auth.routes";

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


]

moduleRoute.forEach((route) => {
    router.use(route.path,route.route)
})