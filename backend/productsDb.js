
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "products-store.json");
const SEED_FILE = path.join(__dirname, "data", "products.json");

function readStore() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = JSON.parse(fs.readFileSync(SEED_FILE, "utf-8"));
    const initial = { products: {} };
    seed.forEach((p) => {
      initial.products[p.id] = p;
    });
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return raw ? JSON.parse(raw) : { products: {} };
}

function writeStore(store) {
  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
}

module.exports = {
  getAll() {
    return Object.values(readStore().products);
  },

  getById(id) {
    return readStore().products[id] || null;
  },

  create(product) {
    const store = readStore();
    store.products[product.id] = product;
    writeStore(store);
    return product;
  },

  update(id, updates) {
    const store = readStore();
    if (!store.products[id]) return null;
    store.products[id] = { ...store.products[id], ...updates };
    writeStore(store);
    return store.products[id];
  },

  remove(id) {
    const store = readStore();
    if (!store.products[id]) return false;
    delete store.products[id];
    writeStore(store);
    return true;
  },
};
