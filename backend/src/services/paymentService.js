// src/services/paymentService.js
import prisma from "../config/prismaClient.js";

// Create a payment
export const createPayment = async (data) => {
  return prisma.payment.create({ data });
};

// Get all payments for a user
export const getPaymentsByUser = async (userId) => {
  return prisma.payment.findMany({
    where: { userId },
    include: { booking: true },
  });
};

// Get payment by booking
export const getPaymentByBooking = async (bookingId) => {
  return prisma.payment.findUnique({
    where: { bookingId },
    include: { booking: true },
  });
};


export const listAllPayments = async () => {
  return prisma.payment.findMany({
    include: {
      booking: true,
      user: true,
    },
  });
};

// ✅ Update payment status (Admin or system)
export const updatePaymentStatus = async (paymentId, status) => {
  return prisma.payment.update({
    where: { id: paymentId },
    data: { status },
  });
};