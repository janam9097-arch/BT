import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductsCard from "../../components/ProductCard/ProductCard";
import { productService } from "../../services/productService";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await productService.getProducts({ search: query });
        setProducts(data.results || data || []);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", minHeight: "60vh", color: "#fff" }}>
      <h2 style={{ color: "#D4AF37", marginBottom: "30px" }}>
        Search Results for: "{query}"
      </h2>

      {loading ? (
        <div style={{ color: "#D4AF37", textAlign: "center", padding: "50px" }}>Searching catalog...</div>
      ) : products.length === 0 ? (
        <div style={{ color: "#aaa", textAlign: "center", padding: "50px" }}>No matching products found.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          {products.map((p) => (
            <ProductsCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
