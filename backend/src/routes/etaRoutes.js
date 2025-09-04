// src/routes/etaRoutes.js
import express from "express";
import { getETAController } from "../controllers/etaController.js";

const router = express.Router();

router.get("/", getETAController);

export default router;
