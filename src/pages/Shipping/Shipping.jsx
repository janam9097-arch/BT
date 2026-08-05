import React from "react";
import "./Shipping.css";

function Shipping() {
  const methods = [
    {
      name: "Standard Ground",
      time: "3 – 5 Business Days",
      cost: "FREE (Orders over ₹1000)",
      notes: "₹99 flat rate for orders under ₹1000",
    },
    {
      name: "Express Delivery",
      time: "2 Business Days",
      cost: "₹250.00",
      notes: "Orders placed before 2 PM IST ship same day",
    },
    {
      name: "Overnight Delivery",
      time: "Next Business Day",
      cost: "₹500.00",
      notes: "Guaranteed next day delivery",
    },
    {
      name: "International Priority",
      time: "5 – 8 Business Days",
      cost: "₹1500.00",
      notes: "Duties and taxes calculated at checkout",
    },
  ];

  return (
    <div className="shipping-page">
      <div className="shipping-header">
        <h1>Shipping Information</h1>
        <p>Worldwide shipping with insured delivery and real-time package tracking.</p>
      </div>

      <div className="shipping-table-wrap">
        <table className="shipping-table">
          <thead>
            <tr>
              <th>Shipping Method</th>
              <th>Estimated Time</th>
              <th>Cost</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m, idx) => (
              <tr key={idx}>
                <td>
                  <strong>{m.name}</strong>
                </td>
                <td>{m.time}</td>
                <td>
                  <span className="shipping-badge">{m.cost}</span>
                </td>
                <td>{m.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="shipping-cards">
        <div className="shipping-info-card">
          <h3>Order Processing</h3>
          <p>
            All orders are processed and packed within 24 hours of payment confirmation, excluding weekends and public holidays.
          </p>
        </div>

        <div className="shipping-info-card">
          <h3>International Customs</h3>
          <p>
            For international orders, import duties and taxes are calculated upfront at checkout. No unexpected fees upon delivery.
          </p>
        </div>

        <div className="shipping-info-card">
          <h3>PO Boxes & APO/FPO</h3>
          <p>
            We ship to PO Boxes and military APO/FPO addresses via USPS Standard Ground. Please allow 1-2 additional transit days.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Shipping;
