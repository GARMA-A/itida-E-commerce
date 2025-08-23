import { Request, Response } from "express";
import Order from "../models/order";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
