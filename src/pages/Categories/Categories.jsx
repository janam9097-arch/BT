import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import { categoryService } from "../../services/categoryService";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data.results || data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <>
      <Navbar />
      <section className="categories-section" style={{ minHeight: "60vh", padding: "40px 20px" }}>
        <h2 className="section-title" style={{ textAlign: "center", color: "#D4AF37", marginBottom: "30px" }}>
          Explore Collections
        </h2>

        {loading ? (
          <div style={{ color: "#D4AF37", textAlign: "center" }}>Loading categories...</div>
        ) : (
          <div className="categories-slider">
            {categories.map((category) => (
              <div className="category-item" key={category.id}>
                <Link to={`/products?category=${category.slug}`} style={{ textDecoration: "none" }}>
                  <CategoryCard category={category} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default Categories;