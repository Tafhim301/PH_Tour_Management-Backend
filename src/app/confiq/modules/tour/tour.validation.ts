import z from "zod";

export const createUpdateTourTypeSchema = z.object({
  name: z.string({ invalid_type_error: "Name must be string" }),
});

export const createTourSchema = z.object({
  title: z.string({ invalid_type_error: "title must be string" }),
  slug: z.string({ invalid_type_error: "slug must be string" }).optional(),
  description: z.string().optional(),
  division: z.string({ invalid_type_error: "division must be string" }),
  tourType: z.string(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  minAge: z.number().optional(),
  maxGuest: z.number().optional(),
  endDate: z.date().optional(),
  startDate: z.date().optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  departureLocation : z.string().optional(),
  arrivalLocation : z.string().optional(),

});

export const updateTourSchema = z.object({
  title: z.string({ invalid_type_error: "title must be string" }).optional(),
  slug: z.string({ invalid_type_error: "slug must be string" }).optional(),
  description: z.string().optional(),
  divison: z.string({ invalid_type_error: "division must be string" }).optional(),
  tourType: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  minAge: z.number().optional(),
  maxGuest: z.number().optional(),
  endDate: z.date().optional(),
  startDate: z.date().optional().optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  deleteImages : z.array(z.string()).optional(),

});
