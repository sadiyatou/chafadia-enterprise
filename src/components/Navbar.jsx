import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import logo from "../assets/images/chafadia-enterprise1.png";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { cart } = useStore();

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <img
            src={logo}
            alt="CHAFADIA ENTERPRISE"
            className="nav-logo"
          />

          <div className="nav-brand-text">
            <div className="nav-brand-title">
              CHAFADIA <span className="gold">ENTERPRISE</span>
            </div>

            <div className="nav-brand-subtitle">
              Where Vision Becomes Legacy
            </div>
          </div>
        </Link>

        <button
          className="nav-menu-btn"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <div className={open ? "nav-links open" : "nav-links"}>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart ({cart.length})</Link>

          {currentUser?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}

          {currentUser?.role === "cashier" && (
            <Link to="/cashier">Cashier</Link>
          )}

          {currentUser?.role === "customer" && (
            <Link to="/customer">Customer</Link>
          )}

          {!currentUser ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
