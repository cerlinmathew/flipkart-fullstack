import { z } from "zod";
    const possibleValues = ["Men's Clothing",
              "Women's Clothing",
              "Jewelery",
             "Electronics"] as const

  type categories =  typeof    possibleValues

  
export const ProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number("Price is required").gt(0, "Price must be greater than 0"),
  description: z.string(""),
  category: z.literal(possibleValues),
  image: z.string("Image must be a string")
});

export type ProductInput = z.infer<typeof ProductSchema>;
export const ProductIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "id must be a valid number")  // URL param
});
    
   




