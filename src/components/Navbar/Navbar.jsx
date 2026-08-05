import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMobileDrawerOpen(false);
    }
  };

  return (
    <header className="header-nav">
      <div className="header-container">
        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>

        {/* Logo (left) — Reverted to clean original "BT" serif font */}
        <Link to="/" className="brand-logo-link">
          <span className="brand-logo-text">BT</span>
        </Link>

        {/* Primary Nav (Desktop) */}
        <nav>
          <ul className="main-nav-ul">
            <li><Link to="/products?category=men" className="main-nav-link">Men</Link></li>
            <li><Link to="/products?category=women" className="main-nav-link">Women</Link></li>
            <li><Link to="/products?category=kids" className="main-nav-link">Kids</Link></li>
            <li><Link to="/categories" className="main-nav-link">Categories</Link></li>
            <li><Link to="/products?filter=sale" className="main-nav-link nav-sale-pill">SALE</Link></li>
          </ul>
        </nav>

        {/* Search Bar (Center, desktop) */}
        <form className="header-search-form" onSubmit={handleSearchSubmit}>
          <FaSearch className="header-search-icon" onClick={handleSearchSubmit} />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search luxury apparel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Action Icons (Right) */}
        <div className="header-actions">
          <button
            className="action-icon-btn"
            onClick={() => navigate(user ? "/profile" : "/login")}
            title={user ? "My Profile" : "Sign In"}
          >
            <FaUser />
          </button>
          <button
            className="action-icon-btn"
            onClick={() => navigate("/wishlist")}
            title="Wishlist"
          >
            <FaHeart />
            {wishlist?.length > 0 && (
              <span className="cart-count-badge" style={{ background: "#ff4d4f", color: "#fff" }}>
                {wishlist.length}
              </span>
            )}
          </button>
          <button
            className="action-icon-btn"
            onClick={() => navigate("/cart")}
            title="Cart"
          >
            <FaShoppingBag />
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Solid dark panel above backdrop) */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileDrawerOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link to="/" className="brand-logo-link" onClick={() => setMobileDrawerOpen(false)}>
                <span className="brand-logo-text">BT</span>
              </Link>
              <button
                style={{ background: "none", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer" }}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form className="header-search-form" style={{ display: "flex", width: "100%" }} onSubmit={handleSearchSubmit}>
              <FaSearch className="header-search-icon" />
              <input
                type="text"
                className="header-search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <nav className="mobile-drawer-links">
              <Link to="/products?category=men" className="mobile-drawer-link" onClick={() => setMobileDrawerOpen(false)}>
                Men <span>›</span>
              </Link>
              <Link to="/products?category=women" className="mobile-drawer-link" onClick={() => setMobileDrawerOpen(false)}>
                Women <span>›</span>
              </Link>
              <Link to="/products?category=kids" className="mobile-drawer-link" onClick={() => setMobileDrawerOpen(false)}>
                Kids <span>›</span>
              </Link>
              <Link to="/categories" className="mobile-drawer-link" onClick={() => setMobileDrawerOpen(false)}>
                Categories <span>›</span>
              </Link>
              <Link to="/products?filter=sale" className="mobile-drawer-link" style={{ color: "var(--gold-primary)", fontWeight: "bold" }} onClick={() => setMobileDrawerOpen(false)}>
                SALE <span>%</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;