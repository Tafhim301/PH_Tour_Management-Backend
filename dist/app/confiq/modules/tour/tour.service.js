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
exports.TourServices = void 0;
const appError_1 = __importDefault(require("../../../ErrorHelpers/appError"));
const tour_constant_1 = require("./tour.constant");
const tour_model_1 = require("./tour.model");
const queryBuilder_1 = require("../../../utils/queryBuilder");
const cloudinary_config_1 = require("../../cloudinary.config");
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.create(payload);
    return tourType;
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return tourType;
});
const getTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.find();
    return tourType;
});
const getSingleTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.findById(id);
    return tourType;
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.findByIdAndDelete(id);
    return tourType;
});
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
const getTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = yield queryBuilder
        .search(tour_constant_1.tourSearchableFields)
        .filter()
        .fields()
        .sort()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryBuilder.getMeta(),
    ]);
    return { meta: meta, data: data };
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new appError_1.default(404, "Tour not found");
    }
    if (payload.images &&
        payload.images.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    if (payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter((imageUrl) => { var _a; return (_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl); });
        const updatedPayloadImages = (payload.images || [])
            .filter((imageUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter((imageUrl) => restDBImages.includes(imageUrl));
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    const tour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        yield Promise.all(payload.deleteImages.map((url) => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return tour;
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_model_1.Tour.findByIdAndDelete(id);
    return null;
});
exports.TourServices = {
    createTourType,
    getTourTypes,
    getSingleTourType,
    updateTourType,
    deleteTourType,
    createTour,
    getTour,
    updateTour,
    deleteTour,
};
