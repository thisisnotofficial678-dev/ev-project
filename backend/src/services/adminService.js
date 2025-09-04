import prisma from "../config/prismaClient.js";

export const dashboardSummary = async () => {
  const [stations, activeBookings, occupiedSlots] = await Promise.all([
    prisma.station.count(),
    prisma.booking.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } }),
    prisma.slot.count({ where: { status: "OCCUPIED" } }),
  ]);

  return {
    stations,
    activeBookings,
    occupiedSlots,
    timestamp: new Date().toISOString(),
  };
};

export const energyStatsDaily = async () => {
  const rows = await prisma.$queryRaw`
    SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::int AS bookings
    FROM "Booking"
    GROUP BY 1
    ORDER BY 1 ASC
  `;
  return rows;
};
