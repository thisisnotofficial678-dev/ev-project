// src/routes/paymentRoutes.js
import express from "express";
import { body, param } from "express-validator";
import {
  createPaymentController,
  getMyPaymentsController,
  getPaymentByBookingController,
  adminListPaymentsController,
  adminUpdatePaymentStatusController,
} from "../controllers/paymentController.js";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";
import { handleValidationErrors } from "../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /payments:
 *   post:
 *     summary: Create a payment for a booking
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, amount, method]
 *             properties:
 *               bookingId: { type: integer, example: 1 }
 *               amount: { type: number, example: 120.5 }
 *               method:
 *                 type: string
 *                 enum: [CARD, UPI, CASH]
 *                 example: CARD
 *     responses:
 *       201: { description: Payment created }
 *       400: { description: Bad request }
 *       401: { description: Unauthorized }
 */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  [
    body("bookingId").isInt().toInt(),
    body("amount").isFloat({ gt: 0 }).toFloat(),
    body("method").isIn(["CARD", "UPI", "CASH"]),
  ],
  handleValidationErrors,
  createPaymentController
);

/**
 * @openapi
 * /payments:
 *   get:
 *     summary: Get my payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 */
router.get("/", authMiddleware, authorizeRoles("USER", "ADMIN"), getMyPaymentsController);

/**
 * @openapi
 * /payments/booking/{bookingId}:
 *   get:
 *     summary: Get payment by booking id
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Payment not found }
 */
router.get(
  "/booking/:bookingId",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  [param("bookingId").isInt().toInt()],
  handleValidationErrors,
  getPaymentByBookingController
);

/**
 * @openapi
 * /payments/admin/all:
 *   get:
 *     summary: Admin - list all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *       403: { description: Forbidden }
 */
router.get("/admin/all", authMiddleware, authorizeRoles("ADMIN"), adminListPaymentsController);

/**
 * @openapi
 * /payments/admin/{id}/status:
 *   patch:
 *     summary: Admin - update payment status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, SUCCESS, FAILED]
 *                 example: SUCCESS
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Bad request }
 *       403: { description: Forbidden }
 */
router.patch(
  "/admin/:id/status",
  authMiddleware,
  authorizeRoles("ADMIN"),
  [param("id").isInt().toInt(), body("status").isIn(["PENDING", "SUCCESS", "FAILED"])],
  handleValidationErrors,
  adminUpdatePaymentStatusController
);

export default router;
