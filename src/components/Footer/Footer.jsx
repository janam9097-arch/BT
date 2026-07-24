import './Footer.css'
import logo from "../../assets/images/logo.png";

function Footer() {
    return (
        <footer className="foot">
            <div className="foot-top">
                <div className="foot-brand">
                    <img src={logo} alt="Store logo" />
                    <p>Sign up for updates on new drops and offers.</p>
                </div>

                <div className="foot-column">
                    <h4>Shop</h4>
                    <ul>
                        <li>Men</li>
                        <li>Women</li>
                        <li>Kids</li>
                        <li>New Arrivals</li>
                    </ul>
                </div>

                <div className="foot-column">
                    <h4>Customer Care</h4>
                    <ul>
                        <li>Track Order</li>
                        <li>Returns & Exchanges</li>
                        <li>Shipping Info</li>
                        <li>FAQs</li>
                    </ul>
                </div>

                <div className="foot-column">
                    <h4>Contact</h4>
                    <ul>
                        <li>support@store.com</li>
                        <li>+1 (555) 123-4567</li>
                        <li>Store Locator</li>
                    </ul>
                </div>
            </div>

            <div className="foot-bottom">
                <p>© 2026 Bangaru Threads. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
export default Footer