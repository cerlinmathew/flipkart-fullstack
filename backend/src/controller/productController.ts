import { Router, Request, Response } from "express";
import pool from "../db";
import { ProductInput } from "../types/product";

const createProductHandler = async (req: Request, res: Response) => {
  // console.log(parsed.error,"ParsedInfo");

  const data: ProductInput = req.body;
  console.log(req,"GET REQUEST");
  const { title, price, description, category, image } = data;

  try {
    const dbResult = await pool.query(
      `INSERT INTO products (title, price, description, category, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING product_id AS id, title, price, description, category, image`,
      [title, price, description, category, image]
    );

    res.status(201).json(dbResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
};

const updateProductHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
   console.log(req.body,'lamoraaa');
   
  const data: ProductInput = req.body;
  const { title, price, description, category, image } = data;

  try {
    const result = await pool.query(
      `UPDATE products
       SET title = $1, price = $2, description = $3, category = $4, image = $5
       WHERE product_id = $6
       RETURNING product_id AS id, title, price, description, category, image`,
      [title, price, description, category, image, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

//get all products
const getProductHandler = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT product_id AS id, title, price, description, category, image
       FROM products
       ORDER BY product_id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

//get product by id
const getProductIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT product_id AS id, title, price, description, category, image
       FROM products WHERE product_id = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};


//delete product
const delProductbyIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
console.log(id);
  try {
    await pool.query("DELETE FROM products WHERE product_id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

//imageupload
// const imageUploadHandler = async (req: Request, res: Response) => {
 
// try{
//     const data = req.file;
//     console.log(data,"lamoraa");
 
//     res.status(201).json();
//   } catch (err) {
//     res.status(500).json({ error: "Failed to add product" });
//   }
// };

export const productRoutes = {
  create: {
    route: "/",
    handler: createProductHandler,
  },
  update: {
    route: "/:id",
    handler: updateProductHandler,
  },
  getProduct: {
    route: "/",
    handler: getProductHandler,
  },
  getProductbyId:{
    route:"/:id",
    handler: getProductIdHandler
  },
  delProduct:{
    route:"/:id",
    handler: delProductbyIdHandler
  },
  //   imageUpload:{
  //   route:"/imageupload",
  //   handler: imageUploadHandler
  // }
};
