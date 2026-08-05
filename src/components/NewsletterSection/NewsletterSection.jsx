import React, { useState } from "react";
import "./NewsletterSection.css";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <span className="newsletter-badge">EXCLUSIVE INSIDER ACCESS</span>
        <h2 className="newsletter-headline">Join the VIP Club & Get 10% Off</h2>
        <p className="newsletter-desc">
          Subscribe to receive private invitations to runway drops, early sale access, and a 10% welcome voucher on your first order.
        </p>

        {submitted ? (
          <div className="newsletter-success-msg">
            ✓ Welcome to the VIP Circle! Your 10% voucher code has been sent to your inbox.
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              className="newsletter-input"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="newsletter-btn">
              Claim 10% Off
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default NewsletterSection;
