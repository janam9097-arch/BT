import "./CategoryCard.css";

function CategoryCard({ category }) {
  const { image, name } = category;

  return (
    <div className="category-card">
      <img
        className="category-img"
        src={image}
        alt={name}
      />

      <h3 className="category-name">
        {name}
      </h3>
    </div>
  );
}

export default CategoryCard;