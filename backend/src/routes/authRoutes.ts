import { Router } from "express";
import { login, logout, refresh, register } from "../controllers/authController";



const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh", refresh);

export default router;
