import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export enum isActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProviders {
    provider : "google" | "credentials";
    providerId : string;
}

export interface IUser {
    _id ?: Types.ObjectId, 
    name : string;
    email: string;
    password ?: string;
    phone ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: string;
    isActive ?: isActive;
    isVerified ?: boolean;
    role : Role;
    auths : IAuthProviders[];
    bookings ?: Types.ObjectId[];
    guide ?: Types.ObjectId[]; 



}