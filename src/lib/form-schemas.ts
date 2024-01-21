import z from "zod";

export const MAX_FILE_SIZE = 1024 * 1024 * 1;
export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/avif",
  "image/webp",
];

export const taskFormSchema = z.object({
  title: z.string().max(255, {
    message: "Title cannot be empty characters",
  }),
  description: z.string().min(15, {
    message: "Description must be at least 15 characters",
  }),
  assets: z.string(),
  brief: z.string(),
  imageFile: z
    .unknown()
    .refine((file: unknown) => {
      if (!file) {
        return false; // File not selected
      }

      return true;
    }, "Please select an image.")

    .refine((file: unknown) => {
      if (file instanceof File) {
        return file.size <= MAX_FILE_SIZE;
      }
      return false;
    }, `Max image size is 1MB.`)
    .refine((file: unknown) => {
      if (file instanceof File) {
        return ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
      }
      return false;
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});
