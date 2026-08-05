import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSearchPlus,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
  FaChevronRight,
  FaTruck,
  FaShieldAlt,
  FaUndo
} from "react-icons/fa";
import "./ProductDetails.css";

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
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // UI States
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Review Form States
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        setSelectedImage(data.primary_image || (data.images && data.images[0]?.url) || "https://picsum.photos/400");

        // Fetch Related Products
        try {
          const relatedRes = await productService.getProducts({ category: data.category_slug || data.category_name });
          const list = relatedRes?.results || relatedRes || [];
          setRelatedProducts(list.filter((p) => String(p.id) !== String(data.id)).slice(0, 4));
        } catch {
          const featured = await productService.getFeaturedProducts();
          const list = featured?.results || [];
          setRelatedProducts(list.filter((p) => String(p.id) !== String(data.id)).slice(0, 4));
        }
      } catch (err) {
        console.error("Product load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div style={{ color: "#D4AF37", padding: "120px 20px", textAlign: "center", fontSize: "18px" }}>
        <FaSpinner className="fa-spin" style={{ fontSize: "32px", marginBottom: "15px" }} />
        <div>Loading luxury details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ color: "#fff", padding: "120px 20px", textAlign: "center" }}>
        <h2>Product Not Found</h2>
        <p style={{ color: "#aaa", marginTop: "10px" }}>The requested item could not be located.</p>
        <Link to="/products" style={{ display: "inline-block", marginTop: "20px", background: "#D4AF37", color: "#000", padding: "12px 24px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" }}>
          Back to Collection
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCartAction = async () => {
    if (!product || addingToCart) return;
    try {
      setAddingToCart(true);
      await addToCart(product.id, selectedVariant?.id || null, quantity, product);
      setAddedToCart(true);
      setToastMessage(`✓ Added ${quantity} item(s) to your cart!`);

      setTimeout(() => setAddedToCart(false), 2500);
      setTimeout(() => setToastMessage(""), 3500);
    } catch (e) {
      console.error("Add to cart error:", e);
      setToastMessage("Failed to add product to cart. Please try again.");
      setTimeout(() => setToastMessage(""), 3500);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id, product);
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
      setToastMessage("✓ Review submitted successfully!");
      setTimeout(() => setToastMessage(""), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Helper star rating renderer
  const renderStars = (rating = 5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  return (
    <div className="pd-wrapper">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="pd-toast">
          <FaCheckCircle style={{ color: "#D4AF37", fontSize: "20px" }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {isZoomOpen && (
        <div className="pd-modal-overlay" onClick={() => setIsZoomOpen(false)}>
          <div className="pd-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="pd-modal-close" onClick={() => setIsZoomOpen(false)}>
              <FaTimes />
            </button>
            <img src={selectedImage} alt={product.title} className="pd-modal-image" />
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="pd-breadcrumbs">
        <Link to="/">Home</Link>
        <FaChevronRight className="separator" />
        <Link to="/products">Collection</Link>
        {product.category_name && (
          <>
            <FaChevronRight className="separator" />
            <Link to={`/products?category=${product.category_slug || product.category_name}`}>
              {product.category_name}
            </Link>
          </>
        )}
        <FaChevronRight className="separator" />
        <span className="current">{product.title}</span>
      </div>

      {/* Main Product Layout */}
      <div className="pd-main-grid">
        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-main-image-container" onClick={() => setIsZoomOpen(true)}>
            <img src={selectedImage} alt={product.title} className="pd-main-image" />
            <div className="pd-zoom-hint">
              <FaSearchPlus /> Zoom Image
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="pd-thumbnails">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  className={`pd-thumbnail ${selectedImage === img.url ? "active" : ""}`}
                  onClick={() => setSelectedImage(img.url)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info & Purchase Details */}
        <div className="pd-info">
          <div>
            <span className="pd-brand-tag">{product.brand_name || "Bangaru Threads Luxury"}</span>
            <div className="pd-header-row">
              <h1 className="pd-title">{product.title}</h1>
              <button
                className={`pd-wishlist-btn ${inWishlist ? "active" : ""}`}
                onClick={handleWishlistToggle}
                aria-label="Wishlist"
              >
                {inWishlist ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="pd-rating-row">
            <div className="pd-stars">{renderStars(product.average_rating || 5)}</div>
            <span>
              <strong>{product.average_rating || "4.9"}</strong> ({product.total_reviews || 12} customer reviews)
            </span>
          </div>

          {/* Price & Stock Card */}
          <div className="pd-price-card">
            <div className="pd-price-box">
              <span className="pd-current-price">${product.discount_price || product.price}</span>
              {product.discount_price && (
                <span className="pd-original-price">${product.price}</span>
              )}
              {product.discount_text && (
                <span className="pd-discount-badge">{product.discount_text}</span>
              )}
            </div>

            <div className="pd-stock-badge">
              <span className="pd-stock-dot" />
              <span>In Stock ({product.stock || 10} available)</span>
            </div>
          </div>

          {/* Short Description */}
          <p style={{ lineHeight: "1.7", color: "#bbb", margin: 0 }}>
            {product.description || "Handcrafted with premium luxury materials and impeccable detail."}
          </p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="pd-variants-section">
              <span className="pd-section-label">Select Options:</span>
              <div className="pd-variants-list">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    className={`pd-variant-btn ${selectedVariant?.id === v.id ? "selected" : ""}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.size && `Size: ${v.size}`} {v.color && `Color: ${v.color}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="pd-qty-section">
            <span className="pd-section-label">Quantity:</span>
            <div className="pd-stepper">
              <button
                className="pd-stepper-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="pd-stepper-value">{quantity}</span>
              <button
                className="pd-stepper-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className={`pd-add-cart-btn ${addedToCart ? "added" : ""}`}
            onClick={handleAddToCartAction}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <>
                <FaSpinner className="fa-spin" /> Adding to Cart...
              </>
            ) : addedToCart ? (
              <>
                <FaCheckCircle /> Added to Cart!
              </>
            ) : (
              <>
                <FaShoppingCart /> Add to Cart
              </>
            )}
          </button>

          {/* Guarantees */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginTop: "10px", borderTop: "1px solid #222", paddingTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#aaa" }}>
              <FaTruck style={{ color: "#D4AF37", fontSize: "18px" }} />
              <span>Complimentary Shipping</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#aaa" }}>
              <FaShieldAlt style={{ color: "#D4AF37", fontSize: "18px" }} />
              <span>Authenticity Guarantee</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#aaa" }}>
              <FaUndo style={{ color: "#D4AF37", fontSize: "18px" }} />
              <span>30 Days Free Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <div className="pd-tabs-container">
        <div className="pd-tabs-header">
          <button
            className={`pd-tab-btn ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description & Details
          </button>
          <button
            className={`pd-tab-btn ${activeTab === "specs" ? "active" : ""}`}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button>
          <button
            className={`pd-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Customer Reviews ({product.total_reviews || 0})
          </button>
        </div>

        <div className="pd-tab-content">
          {activeTab === "description" && (
            <div>
              <h3 style={{ color: "#D4AF37", marginTop: 0 }}>Craftsmanship & Design</h3>
              <p>
                {product.description ||
                  "Designed for royalty, this piece embodies timeless elegance and contemporary luxury. Built using the finest materials and strict quality controls."}
              </p>
              <p style={{ marginTop: "15px" }}>
                Every stitch and seam reflects our commitment to perfection. Perfect for formal galas, VIP occasions, or everyday luxury styling.
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <table className="pd-specs-table">
              <tbody>
                <tr>
                  <td className="spec-name">Brand</td>
                  <td>{product.brand_name || "Bangaru Threads"}</td>
                </tr>
                <tr>
                  <td className="spec-name">Category</td>
                  <td>{product.category_name || "Luxury Collection"}</td>
                </tr>
                <tr>
                  <td className="spec-name">Material & Fabric</td>
                  <td>100% Handcrafted Mulberry Silk & Premium Gold Blend</td>
                </tr>
                <tr>
                  <td className="spec-name">In Stock Units</td>
                  <td>{product.stock || 10} Units</td>
                </tr>
                <tr>
                  <td className="spec-name">Care Instructions</td>
                  <td>Dry clean only. Store in garment dust bag provided.</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 style={{ color: "#D4AF37", marginTop: 0 }}>Customer Reviews</h3>

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} style={{ background: "#181818", padding: "20px", borderRadius: "10px", marginBottom: "30px", border: "1px solid #333" }}>
                  <h4 style={{ margin: "0 0 15px 0", color: "#fff" }}>Leave Your Feedback</h4>
                  <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "15px" }}>
                    <label>Your Rating:</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      style={{ background: "#222", color: "#fff", padding: "8px 16px", border: "1px solid #444", borderRadius: "4px" }}
                    >
                      <option value={5}>5 Stars - Exceptional</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Needs Improvement</option>
                      <option value={1}>1 Star - Unsatisfactory</option>
                    </select>
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe your experience with this luxury product..."
                    rows={3}
                    style={{ width: "100%", background: "#222", color: "#fff", border: "1px solid #444", padding: "12px", borderRadius: "6px", boxSizing: "border-box", fontSize: "14px" }}
                  />
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    style={{ marginTop: "12px", background: "#D4AF37", color: "#000", border: "none", padding: "12px 24px", fontWeight: "bold", cursor: "pointer", borderRadius: "4px" }}
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <p style={{ color: "#aaa", marginBottom: "20px" }}>Please log in to submit a customer review.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pd-related-section">
          <h2 className="pd-related-heading">You May Also Like</h2>
          <div className="pd-related-grid">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="pd-mobile-sticky-bar">
        <button
          className={`pd-wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={handleWishlistToggle}
          aria-label="Wishlist"
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>

        <button
          className={`pd-add-cart-btn ${addedToCart ? "added" : ""}`}
          onClick={handleAddToCartAction}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <FaSpinner className="fa-spin" />
          ) : addedToCart ? (
            <>
              <FaCheckCircle /> Added!
            </>
          ) : (
            <>
              <FaShoppingCart /> Add to Cart (${(parseFloat(product.discount_price || product.price) * quantity).toFixed(2)})
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
