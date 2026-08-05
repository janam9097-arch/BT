import React, { useState, useEffect } from "react";
import Hero from "../../components/Hero/Hero";
import CategoriesSection from "../../components/Categories/CategoriesSection";
import ProductCard from "../../components/ProductCard/ProductCard";
import TrustValueProp from "../../components/TrustValueProp/TrustValueProp";
import Lookbook from "../../components/Lookbook/Lookbook";
import SocialProof from "../../components/SocialProof/SocialProof";
import NewsletterSection from "../../components/NewsletterSection/NewsletterSection";
import { productService } from "../../services/productService";
import { mockProducts } from "../../data/mockProducts";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("-created_at");

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts({ ordering: sortBy });
        const list = data.results || data;
        if (Array.isArray(list) && list.length > 0) {
          setProducts(list);
        } else {
          setProducts(mockProducts);
        }
      } catch (err) {
        console.warn("Using mock products fallback", err);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedProducts();
  }, [sortBy]);

  return (
    <div style={{ backgroundColor: "var(--bg-black)", color: "#fff", width: "100%" }}>
      {/* 1 & 2. Sticky Header & Full-bleed Hero + Trust Bar */}
      <Hero />

      {/* 3. Category Navigation (2x3 grid on mobile, 3x2 on desktop) */}
      <CategoriesSection />

      {/* 4. Featured / Best-Selling Products */}
      <section className="home-products-section section-tight">
        <div className="home-products-header">
          <div>
            <span className="section-eyebrow">CURATED LUXURY APPAREL</span>
            <h2 className="section-main-title" style={{ textAlign: "left" }}>
              Featured Curation
            </h2>
          </div>

          {/* Filter / Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: "#141414",
              color: "var(--gold-primary)",
              border: "1px solid var(--border-gold)",
              padding: "10px 16px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              outline: "none",
            }}
          >
            <option value="-created_at">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-average_rating">Popularity & Rating</option>
          </select>
        </div>

        {loading ? (
          <div style={{ color: "var(--gold-primary)", textAlign: "center", padding: "60px 20px" }}>
            Loading luxury catalog...
          </div>
        ) : (
          <div className="home-products-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Value Proposition / Trust Section */}
      <TrustValueProp />

      {/* 7. New Arrivals / Editorial Lookbook Section */}
      <Lookbook />

      {/* 6. Social Proof / UGC ("Shop the Look") */}
      <SocialProof />

      {/* 8. Dedicated Newsletter Signup Section */}
      <NewsletterSection />
    </div>
  );
}

export default Home;