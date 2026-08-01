import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductsCard from "../../components/ProductCard/ProductCard";
import { productService } from "../../services/productService";
import "./Products.css";

function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("-created_at");

  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = { ordering: sortBy };
        if (categoryParam) params.category = categoryParam;
        if (searchParam) params.search = searchParam;

        const data = await productService.getProducts(params);
        setProducts(data.results || data || []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryParam, searchParam, sortBy]);

  return (
    <section className="products-section" style={{ minHeight: "70vh", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", color: "#fff" }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          {categoryParam ? `${categoryParam.toUpperCase()} Collection` : "Featured Products"}
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: "#111",
            color: "#D4AF37",
            border: "1px solid #D4AF37",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          <option value="-created_at">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="title">Name A-Z</option>
        </select>
      </div>

      {loading ? (
        <div style={{ color: "#D4AF37", textAlign: "center", padding: "50px" }}>Loading catalog...</div>
      ) : products.length === 0 ? (
        <div style={{ color: "#aaa", textAlign: "center", padding: "50px" }}>No products found.</div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <ProductsCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;