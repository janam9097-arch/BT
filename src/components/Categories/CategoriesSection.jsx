import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "./CategoriesSection.css";

const CATEGORY_TILES = [
  {
    id: "men",
    title: "Men's Collection",
    link: "/products?category=men",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    count: "48 Items"
  },
  {
    id: "women",
    title: "Women's Collection",
    link: "/products?category=women",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    count: "62 Items"
  },
  {
    id: "kids",
    title: "Kids Luxury Wear",
    link: "/products?category=kids",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80",
    count: "34 Items"
  },
  {
    id: "accessories",
    title: "Bags & Accessories",
    link: "/products?category=accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
    count: "29 Items"
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    link: "/products?filter=new",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    count: "Just Dropped"
  },
  {
    id: "sale",
    title: "Exclusive Sale",
    link: "/products?filter=sale",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    count: "Up to 50% Off"
  }
];

function CategoriesSection() {
  return (
    <section className="categories-container section-tight">
      <div className="section-header-centered">
        <span className="section-eyebrow">CURATED COLLECTIONS</span>
        <h2 className="section-main-title">Shop by Category</h2>
      </div>

      <div className="category-tiles-grid">
        {CATEGORY_TILES.map((cat) => (
          <Link key={cat.id} to={cat.link} className="category-tile-card">
            <img src={cat.image} alt={cat.title} className="category-tile-img" />
            <div className="category-tile-overlay" />
            <div className="category-tile-content">
              <h3 className="category-tile-name">{cat.title}</h3>
              <span className="category-tile-cta">
                Explore {cat.count} <FaArrowRight style={{ fontSize: "10px" }} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
