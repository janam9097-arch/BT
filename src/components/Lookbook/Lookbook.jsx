import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "./Lookbook.css";

function Lookbook() {
  return (
    <section className="lookbook-section section-tight">
      <div className="lookbook-card">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
          alt="The Royal Silk Heritage Lookbook"
          className="lookbook-img"
        />
        <div className="lookbook-content">
          <span className="lookbook-tag">EDITORIAL LOOKBOOK</span>
          <h2 className="lookbook-title">The Royal Silk & Gold Heritage Collection</h2>
          <p className="lookbook-desc">
            Immerse yourself in our autumn curation. Master weavers combine centuries-old zari craftsmanship with contemporary luxury silhouettes designed for high-society galas.
          </p>
          <div>
            <Link to="/products?filter=new" className="primary-gold-btn" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
              Explore Lookbook <FaArrowRight style={{ fontSize: "12px" }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Lookbook;
