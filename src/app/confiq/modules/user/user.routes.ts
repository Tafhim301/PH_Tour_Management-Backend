import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import z from "zod";

const router = Router();

router.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) => {
    const createUserZodSchema = z.object({
      name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name is too short" })
        .max(50, { message: "Name is too long" }),
      email: z.string().email(),
      password: z
        .string()
        .min(8)
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter",
        })
        .regex(/\d/, {
          message: "Password must contain at least one number",
        })
        .regex(/[^A-Za-z0-9]/, {
          message: "Password must contain at least one special character",
        }),

      phone: z.string({invalid_type_error : "Phone Number must be string"}),

      address: z.string({invalid_type_error : "Address must be string"}).max(200,{
        message : "Address can't exceed 200 characters"
      }),
    });
  },
  UserController.createUser
);
router.get("/all-users", UserController.getAllUsers);

export const userRoutes = router;
