import { Router } from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createTourSchema, createUpdateTourTypeSchema, updateTourSchema } from "./tour.validation";
import { tourControllers } from "./tour.controller";
import { multerUpload } from "../../multer.confg";

const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createUpdateTourTypeSchema),
  tourControllers.createTourType
);
router.post(
  "/create",
  multerUpload.array("files"),
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createTourSchema),
  tourControllers.createTour
);
router.get(
  "/tour-types",
  
  tourControllers.getTourTypes
);
router.get(
  "/",
  
  tourControllers.getTour
);
router.patch(
  "/tour-types/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createUpdateTourTypeSchema),
  tourControllers.updateTourType
);
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(updateTourSchema),
  tourControllers.updateTour
);
router.delete(
  "/tour-types/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),

  tourControllers.deleteTourTypes
);
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),

  tourControllers.deleteTour
);

export const tourRoutes = router;
