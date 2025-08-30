import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCart,
  clearCart,
} from "../controllers/cartController";
import isAuthenticated from "../middlewares/auth/jwt";

const router = Router();

router.use("/", isAuthenticated);
router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCart);
router.delete("/", clearCart);

export default router;
