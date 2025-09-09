import { Router } from "express";
import { getProfile, login, register } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();


router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

export default router;
