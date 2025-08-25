import { Request, Response } from "express";
import User from "../models/User";

// Register a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get a user by ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      delete updates.password; // don’t allow password updates here
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, message: "User permanently deleted" });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// List users with filters + pagination
export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "10", role, isActive } = req.query;

    const filter: Record<string, any> = {};
    if (role) filter.role = role;
    if (isActive) filter.isActive = isActive === "true";

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const users = await User.find(filter)
      .select("-password")
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const count = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
