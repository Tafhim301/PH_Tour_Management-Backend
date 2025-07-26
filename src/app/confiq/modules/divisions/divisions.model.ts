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

divisonSchema.pre("save", async function (next) {
    if( this.isModified("name")){
          const baseSlug = this.name?.toLocaleLowerCase().split(" ").join("-");
          let slug = `${baseSlug}-division`;
          let counter = 0;
        
          while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`;
          }
        
          this.slug = slug;
        
       
    }
    
    
    
    
    next()
    
})


divisonSchema.pre("findOneAndUpdate", async function (next) {

    const division = this.getUpdate() as Partial<IDIvision>

    if(division.name){
       
        const baseSlug = division.name?.toLocaleLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;
        let counter = 0;
    
        while (await Division.exists({ slug })) {
          slug = `${slug}-${counter++}`;
        }
    
        division.slug = slug;
      

    }

    this.setUpdate(division);

    
      




    next()
    
})

export const Division = model<IDIvision>("Division",divisonSchema)