import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { orderService } from "../../services/orderService";
import "./Checkout.css";

function Checkout() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "USA",
    payment_method: "COD",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSubmitting(true);
      // 1. Create order
      const order = await orderService.createOrder(formData);

      // 2. Process payment intent
      const paymentIntent = await orderService.createPaymentIntent(order.id, formData.payment_method);

      // 3. Verify payment if needed
      if (formData.payment_method !== "COD") {
        await orderService.verifyPayment(paymentIntent.payment_id, paymentIntent.transaction_id, "SUCCESS");
      }

      await fetchCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div style={{ color: "#fff", padding: "80px 20px", textAlign: "center" }}>
        Your cart is empty. Cannot proceed to checkout.
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-heading">Checkout</h2>

      {error && <div className="checkout-error">{error}</div>}

      <form onSubmit={handleSubmit} className="checkout-grid">
        {/* Shipping Info */}
        <div>
          <h3 className="checkout-section-title">Shipping Address</h3>

          <div className="form-row-2">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="shipping_name"
                required
                value={formData.shipping_name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="shipping_phone"
                required
                value={formData.shipping_phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label>Street Address</label>
            <input
              type="text"
              name="shipping_address"
              required
              value={formData.shipping_address}
              onChange={handleChange}
              placeholder="123 Luxury Street, Suite 400"
            />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="shipping_city"
                required
                value={formData.shipping_city}
                onChange={handleChange}
                placeholder="New York"
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="shipping_state"
                required
                value={formData.shipping_state}
                onChange={handleChange}
                placeholder="NY"
              />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="shipping_postal_code"
                required
                value={formData.shipping_postal_code}
                onChange={handleChange}
                placeholder="10001"
              />
            </div>
          </div>

          {/* Payment Method */}
          <h3 className="checkout-section-title" style={{ marginTop: "20px" }}>
            Payment Method
          </h3>
          <div className="payment-methods-grid">
            {[
              { id: "COD", label: "Cash on Delivery" },
              { id: "STRIPE", label: "Stripe Credit Card" },
              { id: "RAZORPAY", label: "Razorpay" },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setFormData({ ...formData, payment_method: m.id })}
                className={`payment-method-card ${formData.payment_method === m.id ? "active" : ""}`}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Box */}
        <div className="order-summary-box">
          <h3 style={{ color: "#D4AF37", marginTop: 0, borderBottom: "1px solid #333", paddingBottom: "15px" }}>
            Order Review
          </h3>

          <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "20px" }}>
            {cart.items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                <span>{item.quantity}x {item.product?.title}</span>
                <span style={{ color: "#D4AF37" }}>₹{item.total_price}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #333", paddingTop: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#ccc" }}>
              <span>Subtotal</span>
              <span>₹{cart.subtotal}</span>
            </div>
            {cart.discount_amount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#4caf50" }}>
                <span>Discount</span>
                <span>-₹{cart.discount_amount}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#ccc" }}>
              <span>Tax (5%)</span>
              <span>₹{cart.tax_amount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#ccc" }}>
              <span>Shipping</span>
              <span>{cart.shipping_cost > 0 ? `₹${cart.shipping_cost}` : "FREE"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #333", paddingTop: "15px", marginTop: "15px", fontSize: "20px", fontWeight: "bold", color: "#D4AF37" }}>
              <span>Grand Total</span>
              <span>₹{cart.grand_total}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              marginTop: "25px",
              background: "#D4AF37",
              color: "#000",
              border: "none",
              padding: "16px",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            {submitting ? "Processing Order..." : "Place Order Now"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
