import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createOrder, verifyPayment } from "../api.js";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setError("");
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Razorpay SDK failed to load. Check your internet connection.");
        setLoading(false);
        return;
      }

      const order = await createOrder(token, {
        items: cart.map((item) => ({ id: item.id, qty: item.qty })),
      });

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "ElectroShop (Test)",
        description: "Practice order — Razorpay TEST mode",
        order_id: order.razorpayOrderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#FFB020" },
        handler: async function (response) {
          const result = await verifyPayment(token, {
            orderId: order.orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (result.success) {
            clearCart();
            navigate(`/success/${order.orderId}`);
          } else {
            navigate("/failure");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            navigate("/failure");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        navigate("/failure");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while creating the order.");
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return <p className="muted">Your cart is empty — add a product first.</p>;
  }

  return (
    <section className="checkout">
      <h2>Checkout</h2>

      <div className="checkout-grid">
        <div className="checkout-form">
          <p className="muted">Ordering as <strong>{user.name}</strong> ({user.email})</p>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="btn btn-primary btn-block" disabled={loading} onClick={handlePay}>
            {loading ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")} with Razorpay`}
          </button>

          <p className="test-card-note">
            <strong>Test mode — use Razorpay's test card:</strong><br />
            Card number: 4111 1111 1111 1111 · Any future expiry · Any CVV · Any name<br />
            Or use UPI id <code>success@razorpay</code> to simulate a successful UPI payment.
          </p>
        </div>

        <div className="order-summary">
          <h3>Order summary</h3>
          {cart.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
