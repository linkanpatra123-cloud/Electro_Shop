// db.js
// Pure-JS JSON-file storage — no native compilation needed (no Python /
// build tools required). Good enough for a practice project. Data lives
// in data/store.json and is created automatically on first write.
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "store.json");

function readStore() {
  if (!fs.existsSync(DB_FILE)) {
    return { orders: {}, payments: {} };
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return raw ? JSON.parse(raw) : { orders: {}, payments: {} };
}

function writeStore(store) {
  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
}

module.exports = {
  createOrder(order) {
    const store = readStore();
    store.orders[order.id] = order;
    writeStore(store);
  },

  createPayment(payment) {
    const store = readStore();
    store.payments[payment.id] = payment;
    writeStore(store);
  },

  updateOrderStatus(orderId, paymentStatus, orderStatus) {
    const store = readStore();
    if (store.orders[orderId]) {
      store.orders[orderId].paymentStatus = paymentStatus;
      store.orders[orderId].orderStatus = orderStatus;
      writeStore(store);
    }
  },

  updatePaymentByOrderId(orderId, updates) {
    const store = readStore();
    const payment = Object.values(store.payments).find((p) => p.orderId === orderId);
    if (payment) {
      Object.assign(payment, updates);
      writeStore(store);
    }
  },

  getOrder(id) {
    const store = readStore();
    return store.orders[id] || null;
  },

  getAllOrders() {
    const store = readStore();
    return Object.values(store.orders).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },
};
