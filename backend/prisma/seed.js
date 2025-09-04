import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Users
  const user1 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword1",
      role: "USER",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: "hashedpassword2",
      role: "ADMIN",
    },
  });

  // 2. Stations + Slots
  const station1 = await prisma.station.upsert({
    where: { name: "Station A" },
    update: {},
    create: {
      name: "Station A",
      location: "Downtown",
      latitude: 12.9716,
      longitude: 77.5946,
      totalSlots: 2,
      slots: {
        create: [
          { number: 1, status: "FREE" },
          { number: 2, status: "FREE" },
        ],
      },
    },
    include: { slots: true },
  });

  // 3. Booking
  const booking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      stationId: station1.id,
      slotId: station1.slots[0].id,
      slotTime: new Date(),
      status: "PENDING", // must match enum
    },
  });

  // 4. Payment for booking
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      amount: 150.0,
      method: "CARD",
      status: "SUCCESS",
    },
  });

  // 5. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        title: "Payment Pending",
        body: "Your booking is pending payment.",
      },
      {
        userId: user1.id,
        title: "Booking Confirmed",
        body: "Your booking has been confirmed!",
      },
      {
        userId: admin.id,
        title: "New Booking",
        body: "A new booking was created by John Doe.",
      },
    ],
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
