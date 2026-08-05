import React from "react";
import { FaInstagram, FaStar } from "react-icons/fa";
import "./SocialProof.css";

const UGC_LOOKS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80",
    handle: "@ananya_fashion",
    comment: "Wearing Bangaru Threads silk saree for the wedding night ✨"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80",
    handle: "@vikram_roy",
    comment: "Bespoke tailoring at its finest! Perfect fit."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80",
    handle: "@ria_lifestyle",
    comment: "The gold accents on this dress are magical 🌟"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80",
    handle: "@karan_style",
    comment: "High fashion meets effortless heritage elegance."
  }
];

const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    text: "The silk quality is unmatched! I received so many compliments at our family gala. Bangaru Threads is now my go-to luxury boutique."
  },
  {
    id: 2,
    name: "Rajesh Varma",
    city: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    text: "Exceptional craftsmanship! The sherwani fit perfectly right out of the box and express delivery arrived in less than 48 hours."
  },
  {
    id: 3,
    name: "Meera Nair",
    city: "Bengaluru",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
    text: "Subtle gold detailing and authentic handloom weave. Pure luxury from start to finish."
  }
];

function SocialProof() {
  return (
    <section className="social-proof-container section-tight">
      <div className="section-header-centered">
        <span className="section-eyebrow">SHOP THE LOOK #BANGARUTHREADS</span>
        <h2 className="section-main-title">As Seen On Our VIP Clients</h2>
      </div>

      {/* UGC Instagram Grid */}
      <div className="ugc-grid">
        {UGC_LOOKS.map((item) => (
          <div key={item.id} className="ugc-card">
            <img src={item.image} alt={item.handle} className="ugc-img" />
            <div className="ugc-hover-overlay">
              <FaInstagram style={{ color: "var(--gold-primary)", fontSize: "24px", marginBottom: "6px" }} />
              <span className="ugc-handle">{item.handle}</span>
              <p className="ugc-quote">"{item.comment}"</p>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials Row */}
      <div className="testimonials-row">
        {REVIEWS.map((rev) => (
          <div key={rev.id} className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="testimonial-text">"{rev.text}"</p>
            <div className="testimonial-author">
              <img src={rev.avatar} alt={rev.name} className="testimonial-avatar" />
              <div>
                <h4 className="testimonial-name">{rev.name}</h4>
                <span className="testimonial-city">{rev.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SocialProof;
