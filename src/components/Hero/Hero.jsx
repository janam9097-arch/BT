import "./Hero.css"
import heroBanner from "../../assets/images/hero-banner.png";

function Hero() {
    return (
        <section className="hero">
            <img src={heroBanner} alt="" className="hero-bg" />
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1>Premium Fashion Collection</h1>
                <p>Discover timeless styles for Men, Women & Kids.</p>

                <div className="hero-buttons">
                    <button className="btn-primary">Shop Now</button>
                    <button className="btn-secondary">Explore</button>
                </div>
            </div>
        </section>
    );
}
export default Hero