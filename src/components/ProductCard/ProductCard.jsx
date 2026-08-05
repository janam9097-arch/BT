import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [added, setAdded] = React.useState(false);

  const title = product.title || product.name;
  const image = product.primary_image || product.image || 'https://picsum.photos/400';
  const discountText = product.discount_text || product.discount || (product.discount_price ? `$${product.discount_price}` : `$${product.price}`);
  const slug = product.slug || product.id;
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    navigate(`/product/${slug}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product.id, null, 1, product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="Card" onClick={handleCardClick} style={{ position: 'relative', cursor: 'pointer' }}>
      <button
        onClick={handleWishlistClick}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(0,0,0,0.6)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          color: inWishlist ? '#ff4d4f' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        {inWishlist ? <FaHeart /> : <FaRegHeart />}
      </button>

      <img className="Card-img" src={image} alt={title} />
      <div className="Card-info">
        <p className="Card-name">{title}</p>
        <p className="Card-discount">{discountText}</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <span className="Card-shop">Shop Now</span>
          <button
            onClick={handleAddToCart}
            style={{
              background: added ? '#4caf50' : '#D4AF37',
              color: added ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
            }}
          >
            <FaShoppingCart /> {added ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;