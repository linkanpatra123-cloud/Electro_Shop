
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "users.json");

function readStore() {
  if (!fs.existsSync(DB_FILE)) return { users: {} };
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return raw ? JSON.parse(raw) : { users: {} };
}

function writeStore(store) {
  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
}

module.exports = {
  createUser(user) {
    const store = readStore();
    store.users[user.id] = user;
    writeStore(store);
  },

  findByEmail(email) {
    const store = readStore();
    return (
      Object.values(store.users).find(
        (u) => u.email.toLowerCase() === String(email).toLowerCase()
      ) || null
    );
  },

  findById(id) {
    const store = readStore();
    return store.users[id] || null;
  },
};
