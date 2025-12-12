import { Router, Request, Response } from "express";
import pool from "../db";
import { ProductSchema, ProductInput, ProductIdSchema } from "../types/product";
import z, { success, ZodError, ZodSchema } from "zod";
import { productRoutes } from "../controller/productController";
import {
  handleBodyValidation,
  handleParamsValidation,
} from "../middleware/PayloadValidation";
import { upload } from "../middleware/multer";

const ProductRouter = Router();
   

ProductRouter.post(
  productRoutes.create.route,
  handleBodyValidation(ProductSchema),
  productRoutes.create.handler
);

ProductRouter.put(
  productRoutes.update.route,
  handleParamsValidation(ProductIdSchema),
  handleBodyValidation(ProductSchema),
  productRoutes.update.handler
);

ProductRouter.get(
  productRoutes.getProduct.route,
  productRoutes.getProduct.handler
);

ProductRouter.get(
  productRoutes.getProductbyId.route,
  productRoutes.getProductbyId.handler
);

ProductRouter.delete(
  productRoutes.delProduct.route,
  productRoutes.delProduct.handler
);

// ProductRouter.post(
//   productRoutes.imageUpload.route,
//   upload.single("file"),
//   productRoutes.imageUpload.handler

// );

export default ProductRouter;
