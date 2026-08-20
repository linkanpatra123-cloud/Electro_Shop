import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getOrders } from "../api.js";

export default function Orders() {
  const { token, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders(token).then(setOrders).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="muted">Loading orders…</p>;
  if (orders.length === 0) return <p className="muted">No orders placed yet.</p>;

  return (
    <section>
      <h2>{isAdmin ? "All Orders" : "Your Orders"}</h2>
      <div className="order-table">
        {orders.map((o) => (
          <div className="order-row" key={o.id}>
            <div>
              <strong>{o.id.slice(0, 8)}</strong>
              <div className="muted small">{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <span>{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</span>
            <span>₹{o.totalAmount.toLocaleString("en-IN")}</span>
            <span className={`status-badge status-${o.paymentStatus.toLowerCase()}`}>{o.paymentStatus}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
