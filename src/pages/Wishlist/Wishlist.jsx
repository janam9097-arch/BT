import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ProductsCard from "../../components/ProductCard/ProductCard";
import { useWishlist } from "../../context/WishlistContext";

function Wishlist() {
  const { wishlist, loading } = useWishlist();

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", minHeight: "60vh", color: "#fff" }}>
        <h2 style={{ color: "#D4AF37", marginBottom: "30px" }}>My Wishlist</h2>

        {loading ? (
          <div style={{ color: "#D4AF37", textAlign: "center", padding: "50px" }}>Loading wishlist...</div>
        ) : wishlist.length === 0 ? (
          <div style={{ color: "#aaa", textAlign: "center", padding: "50px" }}>Your wishlist is empty.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {wishlist.map((item) => (
              <ProductsCard key={item.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Wishlist;
