import "./Products.css";
import ProductsCard from "../../components/ProductCard/ProductCard";

function Products() {
    const products = [
  { id: 1, image: 'https://picsum.photos/200?1', name: "Kids Wear", discount: "50-70% OFF" },
  { id: 2, image: 'https://picsum.photos/200?2', name: "Men's Footwear", discount: "50-70% OFF" },
  { id: 3, image: 'https://picsum.photos/200?3', name: "Women's Footwear", discount: "40-80% OFF" },
  { id: 4, image: 'https://picsum.photos/200?4', name: "Bags, Belts & Wallets", discount: "40-70% OFF" },
  { id: 5, image: 'https://picsum.photos/200?5', name: "Office Wear", discount: "40-70% OFF" },
  { id: 6, image: 'https://picsum.photos/200?6', name: "Men's Ethnic Wear", discount: "UP TO 60% OFF" },
  { id: 7, image: 'https://picsum.photos/200?7', name: "Women's Ethnic Wear", discount: "30-70% OFF" },
  { id: 8, image: 'https://picsum.photos/200?8', name: "Watches", discount: "20-50% OFF" },
  { id: 9, image: 'https://picsum.photos/200?9', name: "Sunglasses", discount: "30-60% OFF" },
  { id: 10, image: 'https://picsum.photos/200?10', name: "Glasses", discount: "60-90% OFF" },
];
    return (
        <section className="products-section">
            <h2 className="section-title">Featured Products</h2>

            <div className="products-grid">
                {products.map((p) => (
                    <ProductsCard key={p.id} product={p} />
                ))}
            </div>
        </section>
    );
}

export default Products;