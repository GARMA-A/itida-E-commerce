import { Router } from "express";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  listProducts,
} from "../controllers/productController";

const router = Router();

router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", listProducts);

export default router;
