import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { RequireAuth, RequireAdmin } from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Success from "./pages/Success.jsx";
import Failure from "./pages/Failure.jsx";
import Orders from "./pages/Orders.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/success/:orderId"
            element={
              <RequireAuth>
                <Success />
              </RequireAuth>
            }
          />
          <Route path="/failure" element={<Failure />} />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <span>ElectroShop — practice project · Razorpay TEST mode · no real money moves</span>
      </footer>
    </div>
  );
}
