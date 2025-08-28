import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, password } = req.body;

    if (!firstName || !password) {
      res.status(400).json({
        success: false,
        message: "First name and password are required",
      });
      return;
    }
    const user = await User.findOne({ firstName });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, password } = req.body;

    if (!firstName || !lastName || !password) {
      res.status(400).json({
        success: false,
        message: "First name, last name and password are required",
      });
      return;
    }

    const existingUser = await User.findOne({ firstName });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    if (!/^\d+$/.test(password)) {
      res.status(400).json({
        success: false,
        message: "Password must consist of only numbers",
      });
      return;
    }

    const user = await User.create({
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`, // Generate email
      password,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ success: false, message: "Token required" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.json({ success: true, message: "Logged out successfully" });
};
