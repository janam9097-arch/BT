import React from "react";
import { FaShippingFast, FaRedoAlt, FaAward, FaHeadset } from "react-icons/fa";
import "./TrustValueProp.css";

const VALUE_PROPS = [
  {
    icon: <FaShippingFast />,
    title: "Free Express Delivery",
    desc: "Complimentary priority shipping on all orders over ₹1,000 across India."
  },
  {
    icon: <FaRedoAlt />,
    title: "30-Day Easy Returns",
    desc: "Hassle-free doorstep pickup & instant refund or store credit exchange."
  },
  {
    icon: <FaAward />,
    title: "100% Authentic Luxury",
    desc: "Directly sourced from master weavers and certified designer fashion houses."
  },
  {
    icon: <FaHeadset />,
    title: "24/7 VIP Concierge",
    desc: "Personal styling consultations and dedicated customer support."
  }
];

function TrustValueProp() {
  return (
    <section className="trust-value-section">
      <div className="trust-value-container">
        {VALUE_PROPS.map((item, idx) => (
          <div key={idx} className="trust-card">
            <div className="trust-card-icon-wrap">{item.icon}</div>
            <h3 className="trust-card-title">{item.title}</h3>
            <p className="trust-card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustValueProp;
