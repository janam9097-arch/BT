import React, { useState } from "react";
import { Link } from "react-router-dom";
import { newsletterService } from "../../services/newsletterService";
import "./Footer.css";
import logo from "../../assets/images/logo.png";

function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, type: "", message: "" });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ loading: false, type: "error", message: "Please enter your email." });
      return;
    }

    setStatus({ loading: true, type: "", message: "" });
    try {
      const res = await newsletterService.subscribe(email);
      setStatus({ loading: false, type: "success", message: res.message || "Thank you for subscribing!" });
      setEmail("");
    } catch (err) {
      setStatus({ loading: false, type: "error", message: err.message || "Subscription failed." });
    }
  };

  return (
    <footer className="foot">
      <div className="foot-top">
        <div className="foot-brand">
          <Link to="/" aria-label="Bangaru Threads Home">
            <img src={logo} alt="Store logo" />
          </Link>
          <p>Sign up for updates on new drops and offers.</p>
          <form className="foot-newsletter" onSubmit={handleSubscribe}>
            <div className="foot-newsletter-input-wrap">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status.loading}
                aria-label="Email address for newsletter"
              />
              <button type="submit" disabled={status.loading}>
                {status.loading ? "..." : "Join"}
              </button>
            </div>
            {status.message && (
              <span className={`foot-newsletter-msg foot-newsletter-${status.type}`}>
                {status.message}
              </span>
            )}
          </form>
        </div>

        <div className="foot-column">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products?category=men">Men</Link></li>
            <li><Link to="/products?category=women">Women</Link></li>
            <li><Link to="/products?category=kids">Kids</Link></li>
            <li><Link to="/products?filter=new">New Arrivals</Link></li>
          </ul>
        </div>

        <div className="foot-column">
          <h4>Customer Care</h4>
          <ul>
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/returns">Returns & Exchanges</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
          </ul>
        </div>

        <div className="foot-column">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:support@store.com">support@store.com</a></li>
            <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
            <li><Link to="/store-locator">Store Locator</Link></li>
          </ul>
        </div>
      </div>

      <div className="foot-bottom">
        <p>© 2026 Bangaru Threads. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;