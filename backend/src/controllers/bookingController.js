// src/controllers/bookingController.js
import prisma from "../config/prismaClient.js";
import { logEvent } from "../utils/logger.js"; // ✅ new helper for usage logging

// ✅ Create booking
export const createBooking = async (req, res) => {
  try {
    const { stationId, slotTime, urgent } = req.body;
    const userId = req.user.id;

    const station = await prisma.station.findUnique({
      where: { id: Number(stationId) },
      include: { slots: true }
    });
    if (!station) return res.status(404).json({ message: "Station not found" });

    const clash = await prisma.booking.findFirst({
      where: {
        userId,
        stationId: Number(stationId),
        slotTime: new Date(slotTime),
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    });
    if (clash) return res.status(400).json({ message: "You already have a booking at this time" });

    const freeSlot = await prisma.slot.findFirst({
      where: { stationId: Number(stationId), status: "FREE" },
      orderBy: { number: "asc" }
    });
    if (!freeSlot) return res.status(400).json({ message: "No free slots. Try another time/station." });

    const booking = await prisma.booking.create({
      data: {
        userId,
        stationId: Number(stationId),
        slotId: freeSlot.id,
        slotTime: new Date(slotTime),
        urgent: Boolean(urgent),
        status: "CONFIRMED"
      },
      include: { station: true, slot: true }
    });

    await prisma.slot.update({
      where: { id: freeSlot.id },
      data: { status: "OCCUPIED" }
    });

    // 🔥 Log event
    await logEvent(Number(stationId), userId, "BOOKING_CREATED");

    res.status(201).json({ message: "Booking created", booking });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ✅ Get bookings of logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { station: true, slot: true }
    });
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ✅ Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" }
    });

    if (booking.slotId) {
      await prisma.slot.update({
        where: { id: booking.slotId },
        data: { status: "FREE" }
      });
    }

    // 🔥 Log event
    await logEvent(booking.stationId, req.user.id, "BOOKING_CANCELLED");

    res.json({ message: "Booking cancelled" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ✅ Get bookings for a station
export const getStationBookings = async (req, res) => {
  try {
    const stationId = Number(req.params.stationId);
    const bookings = await prisma.booking.findMany({
      where: { stationId },
      orderBy: { slotTime: "desc" },
      include: { user: true, slot: true }
    });
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ✅ Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const allowed = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    if ((status === "COMPLETED" || status === "CANCELLED") && updated.slotId) {
      await prisma.slot.update({
        where: { id: updated.slotId },
        data: { status: "FREE" }
      });
    }

    // 🔥 Log event
    await logEvent(updated.stationId, updated.userId, `BOOKING_${status}`);

    res.json({ message: "Booking updated", booking: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
