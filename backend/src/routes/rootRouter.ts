import express from "express";
import RootController from "../controllers/rootController";
const router = express.Router();
// Root route
router.get("/", RootController);
export default router;