import express, { Router } from "express";
import RootController from "../controllers/rootController";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  listUsers,
} from "../controllers/userController";

const router: Router = express.Router();

// Root route
router.get("/", RootController);

// CRUD
router.post("/register", createUser);
router.get("/profile/:id", getUser);
router.put("/profile/:id", updateUser);
router.delete("/:id", deleteUser);

// List (Admin)
router.get("/list", listUsers);

export default router;