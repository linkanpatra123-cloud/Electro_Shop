const express = require("express");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();


router.post("/razorpay", express.json({ verify: (req, res, buf) => (req.rawBody = buf) }), (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  if (webhookSecret) {
    const expected = crypto.createHmac("sha256", webhookSecret).update(req.rawBody).digest("hex");
    if (expected !== signature) {
      console.warn("Webhook signature mismatch — ignoring event");
      return res.status(400).json({ error: "Invalid signature" });
    }
  }

  const event = req.body.event;
  console.log("Webhook received:", event);

  if (event === "payment.captured") {
    const paymentEntity = req.body.payload.payment.entity;
    const orderId = paymentEntity.notes && paymentEntity.notes.orderId;
    if (orderId) {
      db.updateOrderStatus(orderId, "PAID", "CONFIRMED");
    }
  }

  if (event === "payment.failed") {
    const paymentEntity = req.body.payload.payment.entity;
    const orderId = paymentEntity.notes && paymentEntity.notes.orderId;
    if (orderId) {
      db.updateOrderStatus(orderId, "FAILED", "CANCELLED");
    }
  }

  res.json({ received: true });
});

module.exports = router;
