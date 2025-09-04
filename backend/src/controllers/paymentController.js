import {
  createPayment,
  getPaymentsByUser,
  getPaymentByBooking,
  updatePaymentStatus,
  listAllPayments,
} from "../services/paymentService.js";
import prisma from "../config/prismaClient.js";

export const createPaymentController = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;

    // ownership check: user can only pay for own booking (admins bypass)
    const booking = await prisma.booking.findUnique({ where: { id: Number(bookingId) } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (req.user.role !== "ADMIN" && booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const payment = await createPayment({ bookingId, amount, method });
    res.status(201).json({ message: "Payment created", payment });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getMyPaymentsController = async (req, res) => {
  try {
    const payments = await getPaymentsByUser(req.user.id);
    res.json(payments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getPaymentByBookingController = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const payment = await getPaymentByBooking(bookingId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // ownership check
    if (req.user.role !== "ADMIN" && payment.booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(payment);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const adminListPaymentsController = async (_req, res) => {
  try {
    const items = await listAllPayments();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const adminUpdatePaymentStatusController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const updated = await updatePaymentStatus(id, status);
    res.json({ message: "Payment updated", payment: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
