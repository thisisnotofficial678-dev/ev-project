import prisma from "../config/prismaClient.js";

export const simulateStationStatus = () => {
  const INTERVAL = 15000; // 15s

  setInterval(async () => {
    try {
      const slot = await prisma.slot.findFirst({ orderBy: { updatedAt: "asc" } });
      if (!slot) return;
      const next = slot.status === "FREE" ? "OCCUPIED" : "FREE";
      await prisma.slot.update({ where: { id: slot.id }, data: { status: next } });
      // console.log(`[sim] slot ${slot.id} -> ${next}`);
    } catch (e) {
      console.error("[sim] error:", e.message);
    }
  }, INTERVAL);
};
