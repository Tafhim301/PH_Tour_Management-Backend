import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { DivisionControllers } from "./divisions.controller";
import { multerUpload } from "../../multer.confg";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single('file'),
  validateRequest(createDivisionZodSchema),
  DivisionControllers.createDivision
);
router.get(
  "/",
 
  DivisionControllers.getDivisions
);
router.get(
  "/:slug",

 
  DivisionControllers.getSingleDivision
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
   multerUpload.single('file'),
  validateRequest(updateDivisionZodSchema),
  DivisionControllers.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),

  DivisionControllers.deleteDivision
);

export const divisionRoutes = router;
