// backend/scripts/generateToken.js
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const secret = process.env.JWT_SECRET || "replace_me_with_a_secret";
const email = process.argv[2] || "testuser@example.com";
const id = process.argv[3] || null; // optional: user id from DB

if (!email && !id) {
  console.error("Usage: node generateToken.js <email> [id]");
  process.exit(1);
}

const payload = { email };
if (id) payload.id = id;

const token = jwt.sign(payload, secret, { expiresIn: "7d" });
console.log("TOKEN:", token);
