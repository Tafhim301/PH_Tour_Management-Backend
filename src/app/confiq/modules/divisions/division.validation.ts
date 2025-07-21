import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z.string({ invalid_type_error: "Divison name must be a string" }),
  slug: z.string({ invalid_type_error: "Slug must be a string" }),
  description: z.string({ invalid_type_error: "description must be string" }).optional(),
  thumbnail: z.string({ invalid_type_error: "thumnail must be a string" }).optional(),
});
export const updateDivisionZodSchema = z.object({
  name: z.string({ invalid_type_error: "Divison name must be a string" }).optional(),
  slug: z.string({ invalid_type_error: "Slug must be a string" }).optional(),
  description: z.string({ invalid_type_error: "description must be string" }).optional(),
  thumbnail: z.string({ invalid_type_error: "thumnail must be a string" }).optional(),
});
