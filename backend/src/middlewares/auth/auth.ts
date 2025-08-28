import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: "Token is not valid." });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};
