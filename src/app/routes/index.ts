import { Router } from "express";
import { userRoutes } from "../confiq/modules/user/user.routes";

export const router = Router();

const moduleRoute = [
    {
        path : "/user",
        route : userRoutes
    }


]

moduleRoute.forEach((route) => {
    router.use(route.path,route.route)
})