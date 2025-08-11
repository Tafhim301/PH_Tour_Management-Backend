import AppError from "../../../ErrorHelpers/appError";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from "../../../utils/queryBuilder";

const createTourType = async (payload: Partial<ITourType>) => {
  const tourType = await TourType.create(payload);
  return tourType;
};
const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const tourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return tourType;
};
const getTourTypes = async () => {
  const tourType = await TourType.find();
  return tourType;
};
const getSingleTourType = async (id : string) => {
  const tourType = await TourType.findById(id);
  return tourType;
};
const deleteTourType = async (id: string) => {
  const tourType = await TourType.findByIdAndDelete(id);
  return tourType;
};

const createTour = async (payload: Partial<ITour>) => {
  const tour = await Tour.create(payload);
  return tour;
};

const getTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .fields()
    .sort()
    .paginate()
    


  const [data,meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta()
  ])


  return {meta : meta, data: data  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new AppError(404, "Tour not found");
  }

  const tour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return tour;
};

const deleteTour = async (id: string) => {
  await Tour.findByIdAndDelete(id);
  return null;
};

export const TourServices = {
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
