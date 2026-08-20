import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { cart, updateQty, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add a few products first.</p>
        <Link to="/" className="btn btn-primary">Browse products</Link>
      </div>
    );
  }

  return (
    <section>
      <h2>Your Cart</h2>
      <div className="cart-list">
        {cart.map((item) => (
          <div className="cart-row" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="cart-row-info">
              <h4>{item.name}</h4>
              <span className="muted">₹{item.price.toLocaleString("en-IN")} each</span>
            </div>
            <div className="qty-control">
              <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
            </div>
            <span className="line-total">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
            <button className="link-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Total</span>
        <span className="price-tag price-tag-lg">₹{total.toLocaleString("en-IN")}</span>
      </div>
      <button className="btn btn-primary btn-block" onClick={() => navigate("/checkout")}>
        Proceed to checkout
      </button>
    </section>
  );
}
