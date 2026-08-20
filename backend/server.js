require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_ID.includes("xxxx")) {
  console.error("\n❌ Razorpay keys are missing or still set to placeholder values.\n");
  console.error("Fix this:");
  console.error("  1. Check that a file named exactly `.env` (not `.env.txt`) exists inside the backend folder.");
  console.error("  2. Open it and make sure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET have your real test keys.");
  console.error("  3. Save the file and restart the server (npm run dev).\n");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("\n❌ JWT_SECRET is missing from your .env file.");
  console.error("Add a line like: JWT_SECRET=any_long_random_string_here\n");
  process.exit(1);
}

const usersDb = require("./usersDb");
const authRoute = require("./routes/auth");
const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");
const webhookRoute = require("./routes/webhook");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));


app.use("/api/webhook", webhookRoute);

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);

app.get("/", (req, res) => {
  res.send("Electro Shop backend is running. Try /api/products");
});

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@electroshop.com";
  const existing = usersDb.findByEmail(email);
  if (existing) return;

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 10);
  usersDb.createUser({
    id: uuidv4(),
    name: "Admin",
    email,
    passwordHash,
    role: "admin",
    createdAt: new Date().toISOString(),
  });
  console.log(`👤 Seeded admin account -> ${email} / (password from .env)`);
}

const PORT = process.env.PORT || 5000;

seedAdmin().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  });
});
