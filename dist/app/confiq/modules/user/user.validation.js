"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name is too short" })
        .max(50, { message: "Name is too long" }),
    email: zod_1.default.string().email(),
    password: zod_1.default
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
    phone: zod_1.default
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    })
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, {
        message: "Address can't exceed 200 characters",
    })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name is too short" })
        .max(50, { message: "Name is too long" })
        .optional(),
    phone: zod_1.default
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    })
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, {
        message: "Address can't exceed 200 characters",
    })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.isActive)).optional(),
    isVerified: zod_1.default.boolean({ invalid_type_error: "isVerified must be true or false" }).optional(),
    isDeleted: zod_1.default.boolean({ invalid_type_error: "isDeleted must be true or false" }).optional()
});
