import React, { useState } from "react";
import "./Returns.css";

function Returns() {
  const [formData, setFormData] = useState({
    orderId: "",
    email: "",
    reason: "size_mismatch",
    comments: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="returns-page">
      <div className="returns-header">
        <h1>Returns & Exchanges</h1>
        <p>Hassle-free 30-day returns and complimentary exchanges on all items.</p>
      </div>

      <div className="returns-grid">
        <div className="returns-card">
          <h2>Return Policy Overview</h2>
          <ul className="policy-list">
            <li className="policy-item">
              <span className="policy-icon">✓</span>
              <div className="policy-text">
                <h4>30-Day Window</h4>
                <p>Return any unused, unwashed item with original tags attached within 30 days of receipt.</p>
              </div>
            </li>
            <li className="policy-item">
              <span className="policy-icon">✓</span>
              <div className="policy-text">
                <h4>Free Exchanges</h4>
                <p>Size or color didn't fit? We cover return shipping for exchange orders.</p>
              </div>
            </li>
            <li className="policy-item">
              <span className="policy-icon">✓</span>
              <div className="policy-text">
                <h4>Prepaid Shipping Label</h4>
                <p>Once submitted, a printable shipping label will be sent instantly to your inbox.</p>
              </div>
            </li>
            <li className="policy-item">
              <span className="policy-icon">✓</span>
              <div className="policy-text">
                <h4>Fast Refunds</h4>
                <p>Refunds are processed within 3-5 business days upon item arrival at our warehouse.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="returns-card">
          <h2>Initiate a Return</h2>
          {submitted ? (
            <div className="returns-success-alert">
              <strong>Return Request Created!</strong>
              <p style={{ marginTop: "6px" }}>
                We have sent a return confirmation and prepaid shipping label to <strong>{formData.email}</strong>.
              </p>
              <button
                className="returns-btn"
                style={{ marginTop: "15px", width: "100%" }}
                onClick={() => setSubmitted(false)}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form className="returns-form" onSubmit={handleSubmit}>
              <div className="returns-form-group">
                <label htmlFor="returnOrderId">Order Number</label>
                <input
                  id="returnOrderId"
                  type="text"
                  placeholder="e.g. ORD-88192"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  required
                />
              </div>

              <div className="returns-form-group">
                <label htmlFor="returnEmail">Account Email</label>
                <input
                  id="returnEmail"
                  type="email"
                  placeholder="e.g. user@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="returns-form-group">
                <label htmlFor="returnReason">Reason for Return</label>
                <select
                  id="returnReason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                >
                  <option value="size_mismatch">Size did not fit</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="defective">Item received damaged/defective</option>
                  <option value="incorrect_item">Received wrong item</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="returns-form-group">
                <label htmlFor="returnComments">Additional Details (Optional)</label>
                <textarea
                  id="returnComments"
                  rows="3"
                  placeholder="Tell us more..."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                />
              </div>

              <button type="submit" className="returns-btn">
                Generate Return Label
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Returns;
