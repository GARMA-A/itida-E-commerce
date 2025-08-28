import express from "express";
import {
  login,
  signup,
  logout,
  verifyToken,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/verify", verifyToken);

export default router;
