import { Router } from "express";
import {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  listUsers,
} from "../controllers/userController";

const router: Router = Router();

// CRUD
router.post("/register", registerUser);
router.get("/profile/:id", getUser);
router.put("/profile/:id", updateUser);
router.delete("/:id", deleteUser);

// List (Admin)
router.get("/", listUsers);

export default router;
