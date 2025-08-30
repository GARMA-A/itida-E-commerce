import { Router } from "express";
import {
  createOrder,
  getOrder,
  updateOrder,
  getUserOrders,
} from "../controllers/orderController";
import isAuthenticated from "../middlewares/auth/jwt";

const router = Router();
router.use("/", isAuthenticated);
router.post("/", createOrder);
router.get("/:id", getOrder);
router.put("/:id", updateOrder);
router.get("/user/:userId", getUserOrders);

export default router;
