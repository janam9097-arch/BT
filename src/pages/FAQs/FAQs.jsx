import React, { useState } from "react";
import "./FAQs.css";

const faqData = [
  {
    id: 1,
    category: "orders",
    question: "How do I place an order on Bangaru Threads?",
    answer: "Browse our collections, select your preferred size and quantity, and click 'Add to Cart'. Proceed to checkout, enter your shipping details, select a payment method, and confirm your order.",
  },
  {
    id: 2,
    category: "orders",
    question: "Can I modify or cancel my order after placing it?",
    answer: "Orders can be modified or canceled within 1 hour of placing them by contacting support@store.com or using the order management section in your profile.",
  },
  {
    id: 3,
    category: "shipping",
    question: "What shipping options are available and how long do they take?",
    answer: "We offer Standard Ground (3-5 business days), Express (2 business days), and Overnight shipping. Free standard shipping applies to orders over $100.",
  },
  {
    id: 4,
    category: "shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 150 countries worldwide via DHL Express and FedEx International Priority with all duties and taxes calculated transparently at checkout.",
  },
  {
    id: 5,
    category: "returns",
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of delivery for unused items in original condition with tags attached. Exchanges are completely free of charge.",
  },
  {
    id: 6,
    category: "products",
    question: "How do I ensure I select the right size?",
    answer: "Each product page features a detailed size chart with specific garment measurements in inches and centimeters. If you are between sizes, we recommend sizing up.",
  },
  {
    id: 7,
    category: "payment",
    question: "Which payment methods do you accept?",
    answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and buy-now-pay-later services like Klarna and Afterpay.",
  },
];

function FAQs() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openIds, setOpenIds] = useState([1]);

  const toggleFaq = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeTab === "all" || item.category === activeTab;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="faqs-page">
      <div className="faqs-header">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about our products, shipping, and services.</p>
      </div>

      <div className="faqs-search">
        <input
          type="text"
          placeholder="Search questions or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="faqs-tabs">
        {["all", "orders", "shipping", "returns", "products", "payment"].map((tab) => (
          <button
            key={tab}
            className={`faqs-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="faqs-list">
        {filteredFaqs.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>
            No questions found matching your search.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div key={faq.id} className={`faq-item ${isOpen ? "open" : ""}`}>
                <div className="faq-question" onClick={() => toggleFaq(faq.id)}>
                  <span>{faq.question}</span>
                  <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && <div className="faq-answer">{faq.answer}</div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default FAQs;
