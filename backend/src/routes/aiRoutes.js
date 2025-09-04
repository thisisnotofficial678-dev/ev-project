import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getETA, recommendStation } from "../controllers/aiController.js";

const router = express.Router();

router.get("/eta", authMiddleware, getETA);
router.get("/recommend", authMiddleware, recommendStation);

export default router;
