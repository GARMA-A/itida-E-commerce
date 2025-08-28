import express from "express";
import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController";
import { authenticate } from "../middlewares/auth/auth";

const router = express.Router();

router.get("/me", authenticate, getCurrentUser);
router.put("/me", authenticate, updateCurrentUser);
router.delete("/me", authenticate, deleteCurrentUser);

router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, getUserById);

export default router;
