"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionServices = void 0;
const appError_1 = __importDefault(require("../../../ErrorHelpers/appError"));
const cloudinary_config_1 = require("../../cloudinary.config");
const divisions_model_1 = require("./divisions.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield divisions_model_1.Division.findOne({ name: payload.name });
    if (division) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Divison Already Exists");
    }
    const newDivision = yield divisions_model_1.Division.create(payload);
    return newDivision;
});
const getDivisions = () => __awaiter(void 0, void 0, void 0, function* () {
    const divisions = yield divisions_model_1.Division.find();
    const totalDivision = yield divisions_model_1.Division.countDocuments();
    const meta = {
        total: totalDivision,
    };
    return { data: divisions, meta };
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const divisions = yield divisions_model_1.Division.findOne({ slug: slug });
    const totalDivision = yield divisions_model_1.Division.countDocuments();
    const meta = {
        total: totalDivision,
    };
    return { data: divisions, meta };
});
const updateDivision = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const divsion = yield divisions_model_1.Division.findById(id);
    if (!divsion) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Division Not found");
    }
    const duplicateDevision = yield divisions_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (duplicateDevision) {
        throw new Error("A divison with this name already exists");
    }
    const updatedDivision = yield divisions_model_1.Division.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (payload.thumbnail && divsion.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(divsion.thumbnail);
    }
    return updatedDivision;
});
const deleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield divisions_model_1.Division.findByIdAndDelete(id);
    return null;
});
exports.DivisionServices = {
    createDivision,
    getDivisions,
    deleteDivision,
    updateDivision,
    getSingleDivision,
};
