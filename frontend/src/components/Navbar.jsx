import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { count } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">⚡</span> Electro<span className="brand-accent">Shop</span>
      </Link>
      <nav className="nav-links">
        <Link to="/">Products</Link>
        {user && <Link to="/orders">Orders</Link>}
        {isAdmin && <Link to="/admin">Admin</Link>}
        <Link to="/cart" className="cart-link">
          Cart
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
        {user ? (
          <div className="nav-user">
            <span className="nav-username">{user.name}{isAdmin ? " (admin)" : ""}</span>
            <button className="btn-link" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
        )}
      </nav>
    </header>
  );
}
