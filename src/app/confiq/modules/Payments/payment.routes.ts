import { Router } from "express";
import { paymentControllers } from "./payment.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post('/init-payment/:id', paymentControllers.initPayment);
router.post('/success', paymentControllers.successPayment);
router.post('/fail', paymentControllers.failPayment);
router.post('/cancel', paymentControllers.cancelPayment);
router.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), paymentControllers.getInvoiceDownloadUrl);




export const paymentRoutes = router