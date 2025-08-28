import express from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  listUsers,
} from "../controllers/userController";

const router = express.Router();


// CRUD
router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// List (Admin)
router.get("/", listUsers);

export default router;
