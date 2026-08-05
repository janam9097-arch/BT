import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaPinterestP } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="footer-brand-title">BANGARU THREADS</div>
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

        {/* Shop Column */}
        <div>
          <h4 className="footer-col-title">Shop Collections</h4>
          <ul className="footer-links-list">
            <li className="footer-link-item"><Link to="/products?category=men">Men's Apparel</Link></li>
            <li className="footer-link-item"><Link to="/products?category=women">Women's Couture</Link></li>
            <li className="footer-link-item"><Link to="/products?category=kids">Kids Premium Wear</Link></li>
            <li className="footer-link-item"><Link to="/products?category=accessories">Bags & Accessories</Link></li>
            <li className="footer-link-item"><Link to="/products?filter=sale" style={{ color: "var(--gold-primary)" }}>Exclusive Sale</Link></li>
          </ul>
        </div>

        {/* Customer Care Column */}
        <div>
          <h4 className="footer-col-title">Customer Care</h4>
          <ul className="footer-links-list">
            <li className="footer-link-item"><Link to="/track-order">Track Your Order</Link></li>
            <li className="footer-link-item"><Link to="/shipping">Shipping Policy</Link></li>
            <li className="footer-link-item"><Link to="/returns">Returns & Exchanges</Link></li>
            <li className="footer-link-item"><Link to="/store-locator">Store Locator</Link></li>
            <li className="footer-link-item"><Link to="/faqs">Help & FAQs</Link></li>
          </ul>
        </div>

        {/* About & Legal Column */}
        <div>
          <h4 className="footer-col-title">About & Legal</h4>
          <ul className="footer-links-list">
            <li className="footer-link-item"><Link to="/about">Our Heritage</Link></li>
            <li className="footer-link-item"><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li className="footer-link-item"><Link to="/terms-of-service">Terms of Service</Link></li>
            <li className="footer-link-item"><Link to="/contact">Contact Concierge</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Payments & Copyright */}
      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          © {new Date().getFullYear()} Bangaru Threads. All Rights Reserved. Crafted for Luxury.
        </div>
        <div className="footer-payment-badges">
          <span className="payment-badge">VISA</span>
          <span className="payment-badge">Mastercard</span>
          <span className="payment-badge">UPI</span>
          <span className="payment-badge">Razorpay</span>
          <span className="payment-badge">Apple Pay</span>
          <span className="payment-badge">COD</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;