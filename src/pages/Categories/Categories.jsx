import "./Categories.css";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import categories from "../../data/categories";

function Categories() {
  return (
    <section className="categories-section">
     

      <div className="categories-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </section>
  );
}

export default Categories;