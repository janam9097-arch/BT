import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaCheck } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const title = product.title || product.name;
  const image = product.primary_image || product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80";
  const slug = product.slug || product.id;
  const inWishlist = isInWishlist(product.id);

  const currentPrice = product.discount_price || product.price;
  const originalPrice = product.discount_price ? product.price : null;

  const handleCardClick = () => {
    navigate(`/product/${slug}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id, product);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product.id, null, 1, product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="product-card-img-wrap">
        {product.discount_text && (
          <span className="product-card-discount-badge">{product.discount_text}</span>
        )}
        <button
          className={`product-card-wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={handleWishlistClick}
          aria-label="Wishlist"
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
        <img className="product-card-img" src={image} alt={title} loading="lazy" />
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{title}</h3>

        <div className="product-card-rating">
          <FaStar />
          <span>{product.average_rating || "4.9"}</span>
          <span className="product-card-rating-count">({product.total_reviews || 18})</span>
        </div>

        <div className="product-card-price-row">
          <span className="product-card-current-price">₹{currentPrice}</span>
          {originalPrice && (
            <span className="product-card-original-price">₹{originalPrice}</span>
          )}
        </div>

        <button
          className={`product-card-add-btn ${added ? "added" : ""}`}
          onClick={handleAddToCart}
        >
          {added ? <><FaCheck /> Added!</> : <><FaShoppingCart /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;