import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

function ProductDetails() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        setSelectedImage(data.primary_image || (data.images && data.images[0]?.url) || "https://picsum.photos/400");
      } catch (err) {
        console.error("Product load error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ color: "#D4AF37", padding: "100px 20px", textAlign: "center" }}>Loading product details...</div>
    );
  }

  if (!product) {
    return (
      <div style={{ color: "#fff", padding: "100px 20px", textAlign: "center" }}>Product not found.</div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, selectedVariant?.id || null, quantity);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      setReviewSubmitting(true);
      await productService.addReview({
        product: product.id,
        rating: newRating,
        comment: newComment,
      });
      setNewComment("");
      const updated = await productService.getProductBySlug(slug);
      setProduct(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", color: "#fff" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
        {/* Gallery */}
        <div>
          <img
            src={selectedImage}
            alt={product.title}
            style={{ width: "100%", height: "450px", objectFit: "cover", borderRadius: "12px", border: "1px solid #333" }}
          />
          {product.images && product.images.length > 1 && (
            <div style={{ display: "flex", gap: "10px", marginTop: "15px", overflowX: "auto" }}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  onClick={() => setSelectedImage(img.url)}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: selectedImage === img.url ? "2px solid #D4AF37" : "1px solid #444",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: "28px", color: "#fff", margin: "0 0 10px 0" }}>{product.title}</h1>
              <p style={{ color: "#aaa", margin: "0 0 15px 0" }}>
                Brand: <span style={{ color: "#D4AF37" }}>{product.brand_name || "Luxury"}</span> | Category:{" "}
                <span style={{ color: "#D4AF37" }}>{product.category_name}</span>
              </p>
            </div>
            <button
              onClick={handleWishlistToggle}
              style={{
                background: "transparent",
                border: "1px solid #444",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                color: inWishlist ? "#ff4d4f" : "#fff",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              {inWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "15px", margin: "20px 0" }}>
            <span style={{ fontSize: "32px", fontWeight: "bold", color: "#D4AF37" }}>
              ${product.discount_price || product.price}
            </span>
            {product.discount_price && (
              <span style={{ textDecoration: "line-through", color: "#777", fontSize: "20px" }}>
                ${product.price}
              </span>
            )}
          </div>

          <p style={{ lineHeight: "1.6", color: "#ccc", marginBottom: "25px" }}>
            {product.description || "Crafted with extraordinary precision and premium luxury material."}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#D4AF37" }}>
                Select Size / Color:
              </label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      background: selectedVariant?.id === v.id ? "#D4AF37" : "#222",
                      color: selectedVariant?.id === v.id ? "#000" : "#fff",
                      border: "1px solid #D4AF37",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    {v.size && `Size: ${v.size}`} {v.color && `Color: ${v.color}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
            <span style={{ fontWeight: "bold" }}>Quantity:</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #444", borderRadius: "4px" }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: "#222", color: "#fff", border: "none", padding: "8px 15px", cursor: "pointer" }}
              >
                -
              </button>
              <span style={{ padding: "8px 20px" }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ background: "#222", color: "#fff", border: "none", padding: "8px 15px", cursor: "pointer" }}
              >
                +
              </button>
            </div>
            <span style={{ color: "#4caf50", fontSize: "14px" }}>In Stock ({product.stock} left)</span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            style={{
              width: "100%",
              background: "#D4AF37",
              color: "#000",
              border: "none",
              padding: "16px",
              borderRadius: "6px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "0.3s",
            }}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: "60px", borderTop: "1px solid #333", paddingTop: "40px" }}>
        <h2 style={{ color: "#D4AF37" }}>Customer Reviews ({product.total_reviews || 0})</h2>

        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} style={{ background: "#111", padding: "20px", borderRadius: "8px", margin: "20px 0" }}>
            <h4 style={{ margin: "0 0 15px 0" }}>Write a Review</h4>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ marginRight: "10px" }}>Rating:</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                style={{ background: "#222", color: "#fff", padding: "6px 12px", border: "1px solid #444" }}
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Poor</option>
                <option value={1}>1 Star - Terrible</option>
              </select>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              style={{ width: "100%", background: "#222", color: "#fff", border: "1px solid #444", padding: "10px", borderRadius: "4px", boxSizing: "border-box" }}
            />
            <button
              type="submit"
              disabled={reviewSubmitting}
              style={{ marginTop: "10px", background: "#D4AF37", color: "#000", border: "none", padding: "10px 20px", fontWeight: "bold", cursor: "pointer", borderRadius: "4px" }}
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p style={{ color: "#aaa" }}>Please log in to leave a review.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
