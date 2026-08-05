import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaTrash, FaArrowRight } from "react-icons/fa";
import "./Cart.css";

function Cart() {
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon, loading } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await applyCoupon(couponCode);
      setCouponMsg(res.message || "Coupon applied!");
    } catch (err) {
      setCouponMsg(err.response?.data?.error || "Invalid coupon.");
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setCouponCode("");
    setCouponMsg("Coupon removed.");
  };

  if (loading) {
    return (
      <div style={{ color: "#D4AF37", padding: "80px 20px", textAlign: "center" }}>Loading shopping cart...</div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="cart-container">
      <h2 className="cart-heading">Shopping Cart ({items.length} items)</h2>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: "18px", color: "#aaa", marginBottom: "20px" }}>Your shopping cart is currently empty.</p>
          <Link to="/products" style={{ background: "#D4AF37", color: "#000", padding: "12px 24px", textDecoration: "none", fontWeight: "bold", borderRadius: "6px" }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Cart Items List */}
          <div>
            {items.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img
                  className="cart-item-img"
                  src={item.product?.primary_image || item.product?.image || "https://picsum.photos/200"}
                  alt={item.product?.title}
                />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.product?.title}</h4>
                  {item.variant && (
                    <p className="cart-item-variant">
                      Variant: {item.variant.size} / {item.variant.color}
                    </p>
                  )}
                  <span className="cart-item-price">₹{item.unit_price}</span>
                </div>

                {/* Quantity Controls */}
                <div className="cart-qty-controls">
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="cart-qty-val">{item.quantity}</span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  ₹{item.total_price}
                </div>

                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="cart-summary-box">
            <h3 style={{ color: "#D4AF37", marginTop: 0, borderBottom: "1px solid #333", paddingBottom: "15px" }}>
              Order Summary
            </h3>

            {/* Coupon Form */}
            <div style={{ marginBottom: "20px" }}>
              <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ flex: 1, padding: "8px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px" }}
                />
                <button type="submit" style={{ background: "#D4AF37", color: "#000", border: "none", padding: "8px 12px", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}>
                  Apply
                </button>
              </form>
              {cart?.coupon_code && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", background: "rgba(212,175,55,0.1)", padding: "6px 10px", borderRadius: "4px" }}>
                  <span style={{ color: "#D4AF37", fontSize: "13px" }}>Applied: {cart.coupon_code}</span>
                  <button onClick={handleRemoveCoupon} style={{ background: "none", border: "none", color: "#ff4d4f", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                </div>
              )}
              {couponMsg && <p style={{ color: "#D4AF37", fontSize: "12px", marginTop: "5px" }}>{couponMsg}</p>}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#ccc" }}>
              <span>Subtotal</span>
              <span>₹{cart?.subtotal || "0.00"}</span>
            </div>
            {cart?.discount_amount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#4caf50" }}>
                <span>Discount</span>
                <span>-₹{cart.discount_amount}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#ccc" }}>
              <span>Estimated Tax (5%)</span>
              <span>₹{cart?.tax_amount || "0.00"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#ccc" }}>
              <span>Shipping</span>
              <span>{cart?.shipping_cost > 0 ? `₹${cart.shipping_cost}` : "FREE"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #333", paddingTop: "15px", marginTop: "15px", fontSize: "20px", fontWeight: "bold", color: "#D4AF37" }}>
              <span>Grand Total</span>
              <span>₹{cart?.grand_total || "0.00"}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                width: "100%",
                marginTop: "25px",
                background: "#D4AF37",
                color: "#000",
                border: "none",
                padding: "14px",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              Proceed to Checkout <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
