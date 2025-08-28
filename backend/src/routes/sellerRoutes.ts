import { Router } from "express";
import {
  createSeller,
  getSeller,
  updateSeller,
  deleteSeller,
  verifyDocuments,
  listSellers,
  updateSellerStatus,
  getSellerDashboard,
} from "../controllers/sellerController";

const router = Router();

router.post("/", createSeller);
router.get("/:id", getSeller);
router.put("/:id", updateSeller);
router.delete("/:id", deleteSeller);
router.post("/:id/verify-documents", verifyDocuments);
router.get("/", listSellers);
router.put("/:id/status", updateSellerStatus);
router.get("/:id/dashboard", getSellerDashboard);

export default router;
