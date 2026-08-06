import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBox, FaHeadset, FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header-nav">
      <div className="header-container">
        {/* Logo (left) — Clean original "BT" serif font */}
        <Link to="/" className="brand-logo-link">
          <span className="brand-logo-text">BT</span>
        </Link>

        {/* Primary Nav (Desktop) */}
        <nav className="desktop-nav-wrap">
          <ul className="main-nav-ul">
            <li><Link to="/products" className="main-nav-link">Shop</Link></li>
            <li><Link to="/products?category=men" className="main-nav-link">Men</Link></li>
            <li><Link to="/products?category=women" className="main-nav-link">Women</Link></li>
            <li><Link to="/products?category=kids" className="main-nav-link">Kids</Link></li>
            <li><Link to="/categories" className="main-nav-link">Categories</Link></li>
            <li><Link to="/products?filter=sale" className="main-nav-link nav-sale-pill">SALE</Link></li>
          </ul>
        </nav>

        {/* Search Bar */}
        <form className="header-search-form" onSubmit={handleSearchSubmit}>
          <button type="submit" className="header-search-submit-btn" aria-label="Search">
            <FaSearch className="header-search-icon" />
          </button>
          <input
            type="text"
            className="header-search-input"
            placeholder="Search luxury apparel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Hamburger Menu Container (Orders, Help Center, Log Out) */}
        <div className="hamburger-menu-container" ref={menuRef}>
          <button
            className={`hamburger-toggle-btn ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {menuOpen && (
            <div className="hamburger-dropdown-menu">
              <div className="hamburger-menu-header">
                <span className="hamburger-menu-title">Account & Support</span>
              </div>
              <ul className="hamburger-menu-list">
                <li>
                  <Link
                    to="/orders"
                    className="hamburger-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaBox className="hamburger-item-icon" />
                    <span>Orders</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faqs"
                    className="hamburger-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaHeadset className="hamburger-item-icon" />
                    <span>Help Center</span>
                  </Link>
                </li>
                <li className="hamburger-menu-divider" />
                <li>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="hamburger-menu-item logout-item"
                    >
                      <FaSignOutAlt className="hamburger-item-icon" />
                      <span>Log Out</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="hamburger-menu-item login-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaSignInAlt className="hamburger-item-icon" />
                      <span>Log In</span>
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;