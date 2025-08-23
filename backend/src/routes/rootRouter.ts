import express from "express";
import RootController from "../controllers/rootController";

const router = express.Router();

router.get("/", RootController);

export default router;
