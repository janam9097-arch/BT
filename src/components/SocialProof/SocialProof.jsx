import React from "react";
import { FaInstagram } from "react-icons/fa";
import "./SocialProof.css";

const UGC_LOOKS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80",
    handle: "@ananya_fashion",
    comment: "Wearing Bangaru Threads silk saree ✨"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80",
    handle: "@vikram_roy",
    comment: "Bespoke tailoring at its finest."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80",
    handle: "@ria_lifestyle",
    comment: "The gold accents are magical 🌟"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80",
    handle: "@karan_style",
    comment: "Effortless heritage elegance."
  }
];

function SocialProof() {
  return (
    <section className="social-proof-container section-tight">
      <div className="section-header-centered">
        <span className="section-eyebrow">SHOP THE LOOK #BANGARUTHREADS</span>
        <h2 className="section-main-title">As Seen On Social</h2>
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
    </section>
  );
}

export default SocialProof;
