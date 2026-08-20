import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getOrder } from "../api.js";

export default function Success() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder(token, orderId).then(setOrder).catch(() => {});
  }, [orderId, token]);

  return (
    <div className="result-state result-success">
      <div className="result-icon">✔</div>
      <h2>Payment successful</h2>
      <p className="muted">Order ID: {orderId}</p>
      {order && (
        <div className="order-summary">
          {order.items.map((item, i) => (
            <div className="summary-row" key={i}>
              <span>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total paid</span>
            <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}
      <Link to="/" className="btn btn-primary">Continue shopping</Link>
    </div>
  );
}
