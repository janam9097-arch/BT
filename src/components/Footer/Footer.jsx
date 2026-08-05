import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaPinterestP } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer className="footer-root">
      {/* Newsletter Bar (Top of Footer) */}
      <div className="footer-newsletter-bar">
        <h3 className="footer-newsletter-title">Subscribe to VIP Concierge</h3>
        <p className="footer-newsletter-subcopy">
          Subscribe to receive private invitations to runway drops, early sale access, and a 10% welcome voucher on your first order.
        </p>

        {submitted ? (
          <div style={{ color: "#4ed87b", fontSize: "14px", fontWeight: "600", marginTop: "10px" }}>
            ✓ Thank you for subscribing! Your 10% welcome code has been sent to your inbox.
          </div>
        ) : (
          <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              required
              className="footer-newsletter-input"
              placeholder="Enter your email address…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="footer-newsletter-btn">
              CLAIM 10% OFF
            </button>
          </form>
        )}
      </div>

      {/* 4-Column Footer Main Content */}
      <div className="footer-container">
        {/* Column 1 — Brand */}
        <div className="footer-brand-col">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="brand-logo-text" style={{ fontSize: "36px" }}>BT</span>
          </Link>
          <p className="footer-brand-desc">
            A luxury fashion house crafting handloom silk, bespoke apparel, and timeless accessories for Men, Women, and Kids.
          </p>
          <div className="footer-social-row">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Pinterest">
              <FaPinterestP />
            </a>
          </div>
        </div>

        {/* Column 2 — Shop Collections */}
        <div className="footer-column">
          <h4 className="footer-col-title">Shop Collections</h4>
          <ul className="footer-links-list">
            <li className="footer-link-item"><Link to="/products?category=men">Men's Apparel</Link></li>
            <li className="footer-link-item"><Link to="/products?category=women">Women's Couture</Link></li>
            <li className="footer-link-item"><Link to="/products?category=kids">Kids Premium Wear</Link></li>
            <li className="footer-link-item"><Link to="/products?category=accessories">Bags & Accessories</Link></li>
            <li className="footer-link-item"><Link to="/products?filter=sale" style={{ color: "var(--gold-primary)", fontWeight: "600" }}>Exclusive Sale</Link></li>
          </ul>
        </div>

        {/* Column 3 — Customer Care */}
        <div className="footer-column">
          <h4 className="footer-col-title">Customer Care</h4>
          <ul className="footer-links-list">
            <li className="footer-link-item"><Link to="/track-order">Track Your Order</Link></li>
            <li className="footer-link-item"><Link to="/shipping">Shipping Policy</Link></li>
            <li className="footer-link-item"><Link to="/returns">Returns & Exchanges</Link></li>
            <li className="footer-link-item"><Link to="/store-locator">Store Locator</Link></li>
            <li className="footer-link-item"><Link to="/faqs">Help & FAQs</Link></li>
          </ul>
        </div>

        {/* Column 4 — About & Legal */}
        <div className="footer-column">
          <h4 className="footer-col-title">About & Legal</h4>
          <ul className="footer-links-list">
            <li className="footer-link-item"><Link to="/about">Our Heritage</Link></li>
            <li className="footer-link-item"><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li className="footer-link-item"><Link to="/terms-of-service">Terms of Service</Link></li>
            <li className="footer-link-item"><Link to="/contact">Contact Concierge</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar — Copyright Line (No payment badges) */}
      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          © 2026 Bangaru Threads. All Rights Reserved. Crafted for Luxury.
        </div>
      </div>
    </footer>
  );
}

export default Footer;