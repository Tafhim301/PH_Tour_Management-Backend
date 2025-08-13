import AppError from "../../../ErrorHelpers/appError";
import { deleteImageFromCloudinary } from "../../cloudinary.config";
import { IDIvision } from "./divisions.interface";
import { Division } from "./divisions.model";
import httpStatus from "http-status-codes";

const createDivision = async (payload: Partial<IDIvision>) => {
  const division = await Division.findOne({ name: payload.name });
  if (division) {
    throw new AppError(httpStatus.BAD_REQUEST, "Divison Already Exists");
  }

  const newDivision = await Division.create(payload);

  return newDivision;
};

const getDivisions = async () => {
  const divisions = await Division.find();
  const totalDivision = await Division.countDocuments();
  const meta = {
    total: totalDivision,
  };

  return { data: divisions, meta };
};
const getSingleDivision = async (slug: string) => {
  const divisions = await Division.findOne({ slug: slug });
  const totalDivision = await Division.countDocuments();
  const meta = {
    total: totalDivision,
  };

  return { data: divisions, meta };
};

const updateDivision = async (id: string, payload: Partial<IDIvision>) => {
  const divsion = await Division.findById(id);
  if (!divsion) {
    throw new AppError(httpStatus.NOT_FOUND, "Division Not found");
  }

  const duplicateDevision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDevision) {
    throw new Error("A divison with this name already exists");
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if(payload.thumbnail && divsion.thumbnail){
    await deleteImageFromCloudinary(divsion.thumbnail)
  }
  return updatedDivision;
};
const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
  return null;
};

export const DivisionServices = {
  createDivision,
  getDivisions,
  deleteDivision,
  updateDivision,
  getSingleDivision,
};
