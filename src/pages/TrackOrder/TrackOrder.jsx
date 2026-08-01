import React, { useState } from "react";
import "./TrackOrder.css";

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult({
        id: orderId.trim().toUpperCase(),
        status: "In Transit",
        carrier: "FedEx Express",
        trackingNo: "FX-982347102-BT",
        estDelivery: "August 4, 2026",
        destination: "New York, NY",
        steps: [
          { label: "Order Placed", done: true },
          { label: "Processing", done: true },
          { label: "In Transit", active: true },
          { label: "Out for Delivery", done: false },
          { label: "Delivered", done: false },
        ],
      });
    }, 600);
  };

  return (
    <div className="track-page">
      <div className="track-header">
        <h1>Track Your Order</h1>
        <p>Enter your order credentials to track real-time shipment updates.</p>
      </div>

      <div className="track-card">
        <form className="track-form" onSubmit={handleTrack}>
          <div className="track-form-group">
            <label htmlFor="orderIdInput">Order ID / Tracking Number</label>
            <input
              id="orderIdInput"
              type="text"
              placeholder="e.g. ORD-109283"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
          </div>

          <div className="track-form-group">
            <label htmlFor="emailInput">Billing Email Address</label>
            <input
              id="emailInput"
              type="email"
              placeholder="e.g. customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="track-btn" disabled={loading}>
            {loading ? "Searching..." : "Track Package"}
          </button>
        </form>

        {result && (
          <div className="track-status-panel">
            <div className="track-status-header">
              <h3>Order {result.id}</h3>
              <span className="track-status-badge">{result.status}</span>
            </div>

            <div className="track-stepper">
              {result.steps.map((s, idx) => (
                <div
                  key={idx}
                  className={`track-step ${s.done ? "completed" : s.active ? "active" : ""}`}
                >
                  <div className="track-step-icon">{s.done ? "✓" : idx + 1}</div>
                  <div className="track-step-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="track-details-grid">
              <div className="track-detail-item">
                <h4>Carrier</h4>
                <p>{result.carrier}</p>
              </div>
              <div className="track-detail-item">
                <h4>Tracking Number</h4>
                <p>{result.trackingNo}</p>
              </div>
              <div className="track-detail-item">
                <h4>Estimated Delivery</h4>
                <p>{result.estDelivery}</p>
              </div>
              <div className="track-detail-item">
                <h4>Destination</h4>
                <p>{result.destination}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;
