import AppError from "../../../ErrorHelpers/appError";
import { IAuthProviders, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../../utils/queryBuilder";
import { userSearchableFields } from "./user.constant";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const doesUserExist = await User.findOne({ email });
  if (doesUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProviders = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,

    ...rest,
  });

  return user;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const users = await queryBuilder
    .search(userSearchableFields)
    .filter()
    .fields()
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);

  return { meta: meta, data: data };
};

const getSingleUser = async(id : string) => {
  const user = User.findById(id)
  return user;
}

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser
};
