import express from "express";
import {
  registerUser,
  loginUser,
  registerSeller,
  loginSeller,
  verifyToken,
} from "../controllers/authController";

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Seller routes
router.post("/seller-register", registerSeller);
router.post("/seller-login", loginSeller);

// Token verification
router.get("/verify", verifyToken);

export default router;