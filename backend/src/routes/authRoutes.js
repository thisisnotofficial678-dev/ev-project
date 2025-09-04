import express from "express";
import { body } from "express-validator";
import { register, login, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { handleValidationErrors } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })],
  handleValidationErrors,
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  handleValidationErrors,
  login
);

router.get("/profile", authMiddleware, getProfile);

export default router;
