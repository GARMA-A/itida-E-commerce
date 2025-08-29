import { Router } from "express";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  listProducts,
} from "../controllers/productController";
import isSeller from "../middlewares/auth/isSeller";

const router = Router();

router.use("/", isSeller);
router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", listProducts);

export default router;
