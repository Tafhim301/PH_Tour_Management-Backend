import AppError from "../../../ErrorHelpers/appError";
import { IDIvision } from "./divisions.interface";
import { Division } from "./divisions.model";
import httpStatus from "http-status-codes";

const createDivision = async (payload: Partial<IDIvision>) => {
  const { slug, name, thumbnail, description } = payload;
  const division = await Division.findOne({ slug });
  if (division) {
    throw new AppError(httpStatus.BAD_REQUEST, "Divison Already Exists");
  }

  const newDivision = await Division.create({
    name: name,
    slug: slug,
    thumbnail: thumbnail,
    description: description,
  });

  return newDivision;
};

const getDivisions = async () => {
  const divisions = await Division.find();

  return divisions;
};

const updateDivision = async (id: string, payload: Partial<IDIvision>) => {
  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedDivision;
};
const deleteDivision = async (id: string) => {
  const updatedDivision = await Division.findByIdAndDelete(id
  );
  return updatedDivision;
};

export const DivisionServices = {
  createDivision,
  getDivisions,
  deleteDivision,
  updateDivision,
};
