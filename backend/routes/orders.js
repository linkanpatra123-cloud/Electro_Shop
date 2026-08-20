const express = require("express");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const db = require("../db");
const productsDb = require("../productsDb");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


router.post("/create", requireAuth, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = productsDb.getById(item.id);
      if (!product) throw new Error(`Invalid product id: ${item.id}`);
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      totalAmount += product.price * qty;
      return { id: product.id, name: product.name, price: product.price, qty };
    });

    const orderId = uuidv4();

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: orderId,
      notes: { orderId },
    });

    db.createOrder({
      id: orderId,
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      customerName: req.user.name,
      customerEmail: req.user.email,
      paymentStatus: "PENDING",
      orderStatus: "CREATED",
      createdAt: new Date().toISOString(),
    });

    db.createPayment({
      id: uuidv4(),
      orderId,
      razorpayOrderId: razorpayOrder.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      amount: totalAmount,
      currency: "INR",
      status: "CREATED",
      createdAt: new Date().toISOString(),
    });

    res.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount * 100,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      items: orderItems,
    });
  } catch (err) {
    console.error("create order error:", err.message);
    res.status(500).json({ error: "Could not create order" });
  }
});


router.post("/verify", requireAuth, (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (isValid) {
    db.updateOrderStatus(orderId, "PAID", "CONFIRMED");
    db.updatePaymentByOrderId(orderId, {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "PAID",
    });
    return res.json({ success: true, message: "Payment verified successfully" });
  }

  db.updateOrderStatus(orderId, "FAILED", "CANCELLED");
  db.updatePaymentByOrderId(orderId, { status: "FAILED" });
  return res.status(400).json({ success: false, message: "Payment verification failed" });
});


router.get("/", requireAuth, (req, res) => {
  const all = db.getAllOrders();
  if (req.user.role === "admin") return res.json(all);
  res.json(all.filter((o) => o.userId === req.user.id));
});

router.get("/:id", requireAuth, (req, res) => {
  const order = db.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (req.user.role !== "admin" && order.userId !== req.user.id) {
    return res.status(403).json({ error: "This isn't your order" });
  }
  res.json(order);
});

module.exports = router;
