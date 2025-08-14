"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourSchema = exports.createTourSchema = exports.createUpdateTourTypeSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUpdateTourTypeSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "Name must be string" }),
});
exports.createTourSchema = zod_1.default.object({
    title: zod_1.default.string({ invalid_type_error: "title must be string" }),
    slug: zod_1.default.string({ invalid_type_error: "slug must be string" }).optional(),
    description: zod_1.default.string().optional(),
    division: zod_1.default.string({ invalid_type_error: "division must be string" }),
    tourType: zod_1.default.string(),
    location: zod_1.default.string().optional(),
    costFrom: zod_1.default.number().optional(),
    minAge: zod_1.default.number().optional(),
    maxGuest: zod_1.default.number().optional(),
    endDate: zod_1.default.date().optional(),
    startDate: zod_1.default.date().optional(),
    images: zod_1.default.array(zod_1.default.string()).optional(),
    amenities: zod_1.default.array(zod_1.default.string()).optional(),
    excluded: zod_1.default.array(zod_1.default.string()).optional(),
    included: zod_1.default.array(zod_1.default.string()).optional(),
    tourPlan: zod_1.default.array(zod_1.default.string()).optional(),
    departureLocation: zod_1.default.string().optional(),
    arrivalLocation: zod_1.default.string().optional(),
});
exports.updateTourSchema = zod_1.default.object({
    title: zod_1.default.string({ invalid_type_error: "title must be string" }).optional(),
    slug: zod_1.default.string({ invalid_type_error: "slug must be string" }).optional(),
    description: zod_1.default.string().optional(),
    divison: zod_1.default.string({ invalid_type_error: "division must be string" }).optional(),
    tourType: zod_1.default.string().optional(),
    location: zod_1.default.string().optional(),
    costFrom: zod_1.default.number().optional(),
    minAge: zod_1.default.number().optional(),
    maxGuest: zod_1.default.number().optional(),
    endDate: zod_1.default.date().optional(),
    startDate: zod_1.default.date().optional().optional(),
    images: zod_1.default.array(zod_1.default.string()).optional(),
    amenities: zod_1.default.array(zod_1.default.string()).optional(),
    excluded: zod_1.default.array(zod_1.default.string()).optional(),
    included: zod_1.default.array(zod_1.default.string()).optional(),
    tourPlan: zod_1.default.array(zod_1.default.string()).optional(),
    deleteImages: zod_1.default.array(zod_1.default.string()).optional(),
});
