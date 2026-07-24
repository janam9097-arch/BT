import logo from "../../assets/images/logo.png";
import { FaSearch } from "react-icons/fa";
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
                <button className="button">Login</button>
                <button className="button">Wishlist</button>
                <button className="button">Cart</button>
            </div>
        </nav>
    );
}

export default Navbar;