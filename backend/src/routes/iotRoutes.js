import express from "express";
import { updateSlotStatus } from "../controllers/iotController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/update-slot", authenticateUser, authorizeRoles("ADMIN"), updateSlotStatus);

export default router;
