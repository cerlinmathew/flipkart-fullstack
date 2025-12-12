import { Router } from "express";
import { CartRoutes } from "../controller/cartController";
import { AddToCartSchema, UpdateQuantitySchema } from "../types/cartType";
import { handleBodyValidation, handleParamsValidation } from "../middleware/PayloadValidation";

const CartRouter = Router();

CartRouter.get(
  CartRoutes.getCartProduct.route,
  CartRoutes.getCartProduct.handler
);

CartRouter.post(
  CartRoutes.addCartProduct.route,
  handleBodyValidation(AddToCartSchema),
  CartRoutes.addCartProduct.handler
);

CartRouter.put(
  CartRoutes.cartItemIncrement.route,
  handleParamsValidation(UpdateQuantitySchema),
  CartRoutes.cartItemIncrement.handler
);

CartRouter.put(
  CartRoutes.cartItemDecrement.route,
  handleParamsValidation(UpdateQuantitySchema),
  CartRoutes.cartItemDecrement.handler
);
CartRouter.delete(
  CartRoutes.cartItemDelete.route,
  CartRoutes.cartItemDelete.handler
);


export default CartRouter;
