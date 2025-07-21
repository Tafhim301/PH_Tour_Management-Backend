import { model, Schema } from "mongoose";
import { IDIvision } from "./divisions.interface";

const divisonSchema = new Schema<IDIvision>({
    name : {type : String , unique : true },
    slug : {type : String , unique : true },
    thumbnail : {type : String},
    description : {type : String},

},{
    timestamps : true,
    versionKey : false
})

export const Division = model<IDIvision>("Division",divisonSchema)