import { z } from "zod";

export const AddToCartSchema = z.object({
  product_id: z.number()
});

export const UpdateQuantitySchema = z.object({
  id: z.string().regex(/^\d+$/, "id must be a valid number")  // URL param
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateQuantityInput = z.infer<typeof UpdateQuantitySchema>;
