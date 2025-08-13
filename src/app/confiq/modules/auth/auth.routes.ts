import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../env";
;
const router = Router()

router.post("/login", authControllers.credentialsLogin)
router.post("/refresh-token", authControllers.getNewAccessToken)
router.post("/logout", authControllers.logout)
router.post("/change-password",checkAuth(...Object.values(Role)), authControllers.changePassowrd)
router.post("/set-password",checkAuth(...Object.values(Role)), authControllers.setPassowrd) 
router.post("/forgot-password", authControllers.forgotPassowrd) 
router.post("/reset-password",checkAuth(...Object.values(Role)), authControllers.resetPassowrd) 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/google', async(req : Request,res : Response,next : NextFunction) => {
    const redirect = req.query.redirect || '/'
    passport.authenticate("google", {scope : ["profile", "email"], state : redirect as string})(req,res)
})
router.get('/google/callback',passport.authenticate("google", {failureRedirect : `${envVars.FRONTEND_URL}/login?error=There is some problem with your account please contact with our support team!`}) ,authControllers.googleCallbackController)

export const AuthRoutes = router