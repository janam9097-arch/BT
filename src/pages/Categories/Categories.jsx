import "./Categories.css";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import categories from "../../data/categories";

function Categories() {
  return (
    <section className="categories-section">
      <div className="categories-slider">
        {categories.map((category) => (
          <div className="category-item" key={category.id}>
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;