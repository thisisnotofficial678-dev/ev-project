import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import etaRoutes from "./routes/etaRoutes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1); // render/proxies

// ----- CORS (allow multiple origins via FRONTEND_URL) -----
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // allow non-browser tools (no Origin) and allowed web origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin not allowed -> ${origin}`));
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
};

// ----- Core middleware -----
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// ----- HTTP server + Socket.IO with same CORS -----
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Socket.IO CORS blocked: ${origin}`));
    },
    credentials: true
  }
});

// map of userId -> socketId
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("register", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`✅ Registered user ${userId} with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    for (const [userId, sId] of userSockets.entries()) {
      if (sId === socket.id) userSockets.delete(userId);
    }
  });
});

// expose io + sockets to routes
app.set("io", io);
app.set("userSockets", userSockets);

// ----- Health & root -----
app.get("/health", (_req, res) => res.status(200).send("ok"));
app.get("/", (_req, res) => res.send("⚡ API Running..."));

// ----- Swagger -----
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ----- Routes -----
app.use("/auth", authRoutes);
app.use("/stations", stationRoutes);
app.use("/bookings", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/ai", aiRoutes);
app.use("/notifications", notificationRoutes);
app.use("/eta", etaRoutes);

// ----- Start server (Render injects PORT) -----
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📖 Swagger at /api-docs`);
});
