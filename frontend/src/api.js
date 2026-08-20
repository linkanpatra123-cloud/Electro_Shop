const BASE_URL = "http://localhost:5000/api";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseOrThrow(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

// ---- Products ----
export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
}

export async function addProduct(token, product) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(product),
  });
  return parseOrThrow(res);
}

export async function updateProduct(token, id, updates) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(updates),
  });
  return parseOrThrow(res);
}

export async function deleteProduct(token, id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return parseOrThrow(res);
}

// ---- Orders ----
export async function createOrder(token, payload) {
  const res = await fetch(`${BASE_URL}/orders/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  return parseOrThrow(res);
}

export async function verifyPayment(token, payload) {
  const res = await fetch(`${BASE_URL}/orders/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getOrder(token, id) {
  const res = await fetch(`${BASE_URL}/orders/${id}`, { headers: authHeaders(token) });
  return parseOrThrow(res);
}

export async function getOrders(token) {
  const res = await fetch(`${BASE_URL}/orders`, { headers: authHeaders(token) });
  return parseOrThrow(res);
}
