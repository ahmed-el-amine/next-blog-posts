import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const postCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export const postUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file.size === 0 || file.size < 4 * 1024 * 1024;
      },
      {
        message: "Image must be less than 4MB",
      }
    ),
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;