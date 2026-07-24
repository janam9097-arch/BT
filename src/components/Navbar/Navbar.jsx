import logo from "../../assets/images/logo.png";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="Nav">
      <img src={logo} alt="Store logo" />

      <ul>
        <li>MEN</li>
        <li>WOMEN</li>
        <li>KIDS</li>
        <li>HOME</li>
      </ul>

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search"
          className="search"
          aria-label="Search products"
        />
      </div>

      <div className="actions">
        <button className="icon-button" aria-label="Login">
          <FaUser />
        </button>
        <button className="icon-button" aria-label="Wishlist">
          <FaHeart />
        </button>
        <button className="icon-button" aria-label="Cart">
          <FaShoppingCart />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;