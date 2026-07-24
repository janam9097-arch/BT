import './ProductCard.css'

function ProductCard({ product }) {
  const { image, name, discount } = product;

  return (
    <div className="Card">
      <img className="Card-img" src={image} alt={name} />
      <div className="Card-info">
        <p className="Card-name">{name}</p>
        <p className="Card-discount">{discount}</p>
        <p className="Card-shop">Shop Now</p>
      </div>
    </div>
  );
}

export default ProductCard;