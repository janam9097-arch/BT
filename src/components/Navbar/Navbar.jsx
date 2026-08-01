import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Navbar.css";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchTerm.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  return (
    <nav className="Nav">
      <Link to="/">
        <img src={logo} alt="Store logo" style={{ cursor: "pointer" }} />
      </Link>

      <ul>
        <li><Link to="/products?category=men" style={{ color: "inherit", textDecoration: "none" }}>MEN</Link></li>
        <li><Link to="/products?category=women" style={{ color: "inherit", textDecoration: "none" }}>WOMEN</Link></li>
        <li><Link to="/products?category=kids" style={{ color: "inherit", textDecoration: "none" }}>KIDS</Link></li>
        <li><Link to="/categories" style={{ color: "inherit", textDecoration: "none" }}>CATEGORIES</Link></li>
      </ul>

      <div className="search-box">
        <FaSearch className="search-icon" onClick={handleSearchSubmit} style={{ cursor: "pointer" }} />

        <input
          type="text"
          placeholder="Search products..."
          className="search"
          aria-label="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
      </div>

      <div className="actions">
        <button
          className="icon-button"
          aria-label="Account"
          onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
        >
          <FaUser />
        </button>

        <button
          className="icon-button"
          aria-label="Wishlist"
          onClick={() => navigate("/wishlist")}
          style={{ position: "relative" }}
        >
          <FaHeart />
          {wishlistCount > 0 && (
            <span style={badgeStyle}>{wishlistCount}</span>
          )}
        </button>

        <button
          className="icon-button"
          aria-label="Cart"
          onClick={() => navigate("/cart")}
          style={{ position: "relative" }}
        >
          <FaShoppingCart />
          {cartCount > 0 && (
            <span style={badgeStyle}>{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

const badgeStyle = {
  position: "absolute",
  top: "-6px",
  right: "-6px",
  background: "#D4AF37",
  color: "#000",
  fontSize: "11px",
  fontWeight: "bold",
  borderRadius: "50%",
  width: "18px",
  height: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Navbar;