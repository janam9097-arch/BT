import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

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

        {/* Search Bar (Right) */}
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
      </div>
    </header>
  );
}

export default Navbar;