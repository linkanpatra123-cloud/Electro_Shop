const express = require("express");
const { v4: uuidv4 } = require("uuid");
const productsDb = require("../productsDb");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();


router.get("/", (req, res) => {
  res.json(productsDb.getAll());
});


router.get("/:id", (req, res) => {
  const product = productsDb.getById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});


router.post("/", requireAuth, requireAdmin, (req, res) => {
  const { name, category, price, stock, image, description } = req.body;
  if (!name || price === undefined || price === "") {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const product = {
    id: uuidv4(),
    name,
    category: category || "Uncategorized",
    price: Number(price),
    stock: Number(stock) || 0,
    image: image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
    description: description || "",
  };
  productsDb.create(product);
  res.status(201).json(product);
});


router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const updates = { ...req.body };
  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.stock !== undefined) updates.stock = Number(updates.stock);

  const updated = productsDb.update(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: "Product not found" });
  res.json(updated);
});


router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  const removed = productsDb.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: "Product not found" });
  res.json({ success: true });
});

module.exports = router;
