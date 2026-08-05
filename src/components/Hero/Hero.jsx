import React from "react";
import { Link } from "react-router-dom";
import { FaShippingFast, FaUndo, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import heroBanner from "../../assets/images/hero-banner.png";
import "./Hero.css";

function Hero() {
  return (
    <section>
      {/* Full-bleed Hero */}
      <div className="hero-container">
        <img
          src={heroBanner}
          alt="Bangaru Threads Luxury Fashion Collection"
          className="hero-background-img"
        />
        <div className="hero-content-wrapper">
          <div className="hero-text-card">
            <span className="hero-eyebrow">AUTUMN/WINTER 2026</span>
            <h1 className="hero-headline">Elevate Your Everyday Luxury Apparel</h1>
            <p className="hero-subcopy">
              Handcrafted silk textiles, bespoke tailoring, and timeless heritage fashion for Men, Women & Kids.
            </p>
            <div className="hero-actions-row">
              <Link to="/products" className="primary-gold-btn">
                Shop Now
              </Link>
              <Link to="/categories" className="secondary-text-link">
                Explore Collections <FaArrowRight style={{ fontSize: "12px" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar directly under hero */}
      <div className="trust-bar">
        <div className="trust-bar-container">
          <div className="trust-item">
            <FaShippingFast className="trust-item-icon" />
            <span>Free Express Shipping over ₹1,000</span>
          </div>
          <div className="trust-item">
            <FaUndo className="trust-item-icon" />
            <span>30-Day Hassle-Free Returns</span>
          </div>
          <div className="trust-item">
            <FaShieldAlt className="trust-item-icon" />
            <span>100% Insured & Secure Payments</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;