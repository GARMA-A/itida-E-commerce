import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCart,
  clearCart,
} from "../controllers/cartController";

const router = Router();

router.get("/:userId", getCart);
router.post("/", addToCart);
router.put("/:id", updateCart);
router.delete("/:userId", clearCart);

export default router;
