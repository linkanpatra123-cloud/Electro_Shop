import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../api.js";

const emptyForm = { name: "", category: "", price: "", stock: "", image: "", description: "" };

export default function Admin() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    getProducts().then(setProducts).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    try {
      await addProduct(token, form);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStockChange(id, stock) {
    try {
      await updateProduct(token, id, { stock: Number(stock) });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemove(id) {
    if (!window.confirm("Remove this product? This can't be undone.")) return;
    try {
      await deleteProduct(token, id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="muted">Loading…</p>;

  return (
    <section>
      <h2>Admin — Manage Products</h2>

      <form className="admin-form" onSubmit={handleAdd}>
        <h3>Add a new product</h3>
        <div className="admin-form-grid">
          <label>
            Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Audio, Laptops…" />
          </label>
          <label>
            Price (₹)
            <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </label>
          <label>
            Stock
            <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </label>
          <label>
            Image URL
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
          </label>
          <label>
            Description
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary" type="submit">Add product</button>
      </form>

      <h3>Current products ({products.length})</h3>
      <div className="admin-table">
        {products.map((p) => (
          <div className="admin-row" key={p.id}>
            <img src={p.image} alt={p.name} />
            <div className="admin-row-info">
              <strong>{p.name}</strong>
              <div className="muted small">{p.category} · ₹{p.price.toLocaleString("en-IN")}</div>
            </div>
            <label className="stock-edit">
              Stock
              <input
                type="number"
                min="0"
                defaultValue={p.stock}
                onBlur={(e) => handleStockChange(p.id, e.target.value)}
              />
            </label>
            <button className="link-danger" onClick={() => handleRemove(p.id)}>Remove</button>
          </div>
        ))}
      </div>
    </section>
  );
}
