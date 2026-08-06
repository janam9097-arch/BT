import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaHeart, FaShoppingBag, FaUser } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import "./MobileBottomNav.css";

function MobileBottomNav() {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/" className={`mobile-bottom-nav-item ${isActive("/") ? "active" : ""}`}>
        <FaHome className="mobile-bottom-nav-icon" />
        <span>Home</span>
      </Link>
      <Link to="/wishlist" className={`mobile-bottom-nav-item ${isActive("/wishlist") ? "active" : ""}`}>
        <FaHeart className="mobile-bottom-nav-icon" />
        {wishlist?.length > 0 && <span className="mobile-bottom-badge">{wishlist.length}</span>}
        <span>Wishlist</span>
      </Link>
      <Link to="/cart" className={`mobile-bottom-nav-item ${isActive("/cart") ? "active" : ""}`}>
        <FaShoppingBag className="mobile-bottom-nav-icon" />
        {cartCount > 0 && <span className="mobile-bottom-badge">{cartCount}</span>}
        <span>Cart</span>
      </Link>
      <Link to={user ? "/profile" : "/login"} className={`mobile-bottom-nav-item ${isActive("/profile") || isActive("/login") ? "active" : ""}`}>
        <FaUser className="mobile-bottom-nav-icon" />
        <span>Account</span>
      </Link>
    </nav>
  );
}

export default MobileBottomNav;
