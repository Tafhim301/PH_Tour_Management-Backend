"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "Divison name must be a string" }),
    slug: zod_1.default.string({ invalid_type_error: "Slug must be a string" }).optional(),
    description: zod_1.default.string({ invalid_type_error: "description must be string" }).optional(),
    thumbnail: zod_1.default.string({ invalid_type_error: "thumnail must be a string" }).optional(),
});
exports.updateDivisionZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "Divison name must be a string" }).optional(),
    slug: zod_1.default.string({ invalid_type_error: "Slug must be a string" }).optional(),
    description: zod_1.default.string({ invalid_type_error: "description must be string" }).optional(),
    thumbnail: zod_1.default.string({ invalid_type_error: "thumnail must be a string" }).optional(),
});
