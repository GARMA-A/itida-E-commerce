import { Request, Response } from "express";
import Cart from "../models/Cart";

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, price } = req.body;

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price });
    }

    await cart.save();
    res.json(cart);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.userId },
      { items: [] },
      { new: true }
    );
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json({ message: "Cart cleared", cart });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
