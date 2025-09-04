import prisma from "../config/prismaClient.js";

export const updateSlotStatus = async (req, res) => {
  try {
    const { slotId, status } = req.body;
    const allowed = ["FREE", "OCCUPIED", "OUT_OF_SERVICE"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const slot = await prisma.slot.update({
      where: { id: Number(slotId) },
      data: { status },
    });

    res.json({ message: "Slot updated", slot });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
