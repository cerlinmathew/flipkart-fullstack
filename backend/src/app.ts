import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
