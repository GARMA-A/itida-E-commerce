import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Seller from "../models/Seller";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// User Registration
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id, type: "user" }, JWT_SECRET, { expiresIn: "7d" });
    
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: "user"
      },
      token
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// User Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user || !await user.comparePassword(password)) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ id: user._id, type: "user" }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: "user"
      },
      token
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seller Login (using business email and creating a simplified approach)
export const loginSeller = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // For now, we'll authenticate sellers using their business email
    // In a real app, you might want to have separate authentication
    const seller = await Seller.findOne({ businessEmail: email }).populate('userId');
    
    if (!seller || !seller.userId) {
      res.status(401).json({ success: false, message: "Seller not found" });
      return;
    }

    // Check password against the associated user account
    const user = await User.findById(seller.userId).select("+password");
    if (!user || !await user.comparePassword(password)) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ id: seller._id, type: "seller" }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({
      success: true,
      user: {
        id: seller._id,
        email: seller.businessEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        businessName: seller.businessName,
        type: "seller"
      },
      token
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Simple seller registration for demo purposes
export const registerSeller = async (req: Request, res: Response): Promise<void> => {
  try {
    // First create a user account for the seller
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber
    };
    
    const user = await User.create(userData);
    
    // Then create the seller profile
    const sellerData = {
      ...req.body,
      userId: user._id,
      businessEmail: req.body.email
    };
    
    const seller = await Seller.create(sellerData);
    const token = jwt.sign({ id: seller._id, type: "seller" }, JWT_SECRET, { expiresIn: "7d" });
    
    res.status(201).json({
      success: true,
      user: {
        id: seller._id,
        email: seller.businessEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        businessName: seller.businessName,
        type: "seller"
      },
      token
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Verify Token
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; type: string };
    
    let result;
    if (decoded.type === "seller") {
      const seller = await Seller.findById(decoded.id).populate('userId');
      if (!seller || !seller.userId) {
        res.status(401).json({ success: false, message: "Invalid token" });
        return;
      }
      result = {
        id: seller._id,
        email: seller.businessEmail,
        firstName: seller.userId.firstName,
        lastName: seller.userId.lastName,
        businessName: seller.businessName,
        type: "seller"
      };
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401).json({ success: false, message: "Invalid token" });
        return;
      }
      result = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: "user"
      };
    }

    res.json({ success: true, user: result });
  } catch (error: any) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};