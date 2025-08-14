import z from "zod";
import { isActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
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
    })
    .optional(),

  phone: z
    .string({ invalid_type_error: "Phone Number must be string" })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, {
      message: "Address can't exceed 200 characters",
    })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name is too short" })
    .max(50, { message: "Name is too long" })
    .optional(),


  phone: z
    .string({ invalid_type_error: "Phone Number must be string" })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, {
      message: "Address can't exceed 200 characters",
    })
    .optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),

  isActive: z.enum(Object.values(isActive) as [string]).optional(),

  isVerified : z.boolean({invalid_type_error : "isVerified must be true or false"}).optional(),

  isDeleted : z.boolean({invalid_type_error : "isDeleted must be true or false"}).optional()
});
