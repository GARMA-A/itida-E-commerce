import { Router } from "express";
import {
  createOrder,
  getOrder,
  updateOrder,
  getUserOrders,
} from "../controllers/orderController";

const router = Router();

router.post("/", createOrder);
router.get("/:id", getOrder);
router.put("/:id", updateOrder);
router.get("/user/:userId", getUserOrders);

export default router;
