import { Request, Response } from "express";
import pool from "../db";
import { AddToCartSchema, UpdateQuantitySchema } from "../types/cartType";

async function getCartItem(id: number) {
  const result = await pool.query(
    `
    SELECT 
      c.id,
      c.product_id,
      c.quantity,
      c.total_price,
      p.title,
      p.price,
      p.image
    FROM cart_items c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.id = $1
  `,
    [id]
  );

  return result.rows[0];
}


const cartProduct = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.product_id,
        c.quantity,
        c.total_price,
        p.title,
        p.price,
        p.image
      FROM cart_items c
      JOIN products p ON c.product_id = p.product_id
      ORDER BY c.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};


// ADD TO CART
const addCartProduct = async (req: Request, res: Response) => {
  const { product_id } = req.body;

  try {
    // Check if exists
    const existing = await pool.query(
      "SELECT id FROM cart_items WHERE product_id = $1",
      [product_id]
    );
    
    let idToReturn;

    if (existing.rows.length > 0) {
      // Update existing
      const updated = await pool.query(
        `UPDATE cart_items
         SET quantity = quantity + 1,
             total_price = (quantity + 1) * (SELECT price FROM products WHERE product_id = $1)
         WHERE product_id = $1
         RETURNING id`,
        [product_id]
      );

      idToReturn = updated.rows[0].id;
    } else {
      // Insert new
      const inserted = await pool.query(
        `INSERT INTO cart_items (product_id, quantity, total_price)
         VALUES ($1, 1, (SELECT price FROM products WHERE product_id = $1))
         RETURNING id`,
        [product_id]
      );
      idToReturn = inserted.rows[0].id;
    }
    // Return FULL item
    const fullItem = await pool.query(
      `SELECT 
        c.id, c.product_id, c.quantity, c.total_price,
        p.title, p.price, p.image
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.id = $1`,
      [idToReturn]
    );

    console.log("fullItem",fullItem)

    res.json(fullItem.rows[0]);

  } catch (err) {
    console.log("erroe Message", err)
    res.status(500).json({ error: "Failed to add to cart" });
  }
};



const cartItemIncrement = async (req: Request, res: Response) => {
   console.log("entered");
  const id = Number(req.params.id);
  console.log(id, "ID RECEIVED");
  try {
    await pool.query(
      `
      UPDATE cart_items
      SET quantity = quantity + 1,
          total_price = (quantity + 1) * (SELECT price FROM products WHERE product_id = cart_items.product_id)
      WHERE id = $1
    `,
      [id]
    );

    const full = await getCartItem(id);
    res.json(full);
  } catch (err) {
    res.status(500).json({ error: "Failed to increase quantity" });
  }
};

const cartItemDecrement = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const item = await pool.query("SELECT quantity FROM cart_items WHERE id = $1", [id]);

    if (item.rows.length === 0) 
        return res.json({ message: "Item not found" });
    if (item.rows[0].quantity <= 1) 
        return res.json({ message: "Quantity already 1" });

    await pool.query(
      `
      UPDATE cart_items
      SET quantity = quantity - 1,
          total_price = (quantity - 1) * (SELECT price FROM products WHERE product_id = cart_items.product_id)
      WHERE id = $1
    `,
      [id]
    );

    const full = await getCartItem(id);
    res.json(full);

  } catch (err) {
    res.status(500).json({ error: "Failed to decrease quantity" });
  }
};


const cartItemRemove = async (req: Request, res: Response) => {
  const parsed = UpdateQuantitySchema.safeParse(req.params);
  if (!parsed.success) return res.status(400).json({ error: "Invalid ID" });

  const id = Number(parsed.data.id);

  try {

    await pool.query("DELETE FROM cart_items WHERE id = $1", [id]);
    res.json({ id });
    
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item" });
  }
};


export const CartRoutes = {
    getCartProduct:{
        route: "/",
        handler: cartProduct
    },
    addCartProduct:{
        route: "/add",
        handler: addCartProduct
    },
    cartItemIncrement:{
        route: "/increase/:id",
        handler: cartItemIncrement
    },
     cartItemDecrement:{
        route: "/decrease/:id",
        handler: cartItemDecrement
    },
      cartItemDelete:{
        route: "/:id",
        handler: cartItemRemove
    }
}