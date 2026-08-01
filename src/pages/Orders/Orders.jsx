import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrders();
        setOrders(data.results || data || []);
      } catch (err) {
        console.error("Orders load error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED": return "#4caf50";
      case "SHIPPED": return "#2196f3";
      case "PROCESSING": return "#ff9800";
      case "CANCELLED": return "#f44336";
      case "RETURNED": return "#9c27b0";
      default: return "#D4AF37";
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", color: "#fff", minHeight: "60vh" }}>
      <h2 style={{ color: "#D4AF37", marginBottom: "30px" }}>Order History</h2>

      {loading ? (
        <div style={{ color: "#D4AF37", textAlign: "center", padding: "50px" }}>Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "#aaa", fontSize: "18px", marginBottom: "20px" }}>You have placed no orders yet.</p>
          <Link to="/products" style={{ background: "#D4AF37", color: "#000", padding: "12px 24px", textDecoration: "none", fontWeight: "bold", borderRadius: "6px" }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#111",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <div>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "#D4AF37", marginBottom: "5px" }}>
                  Order #{order.order_number}
                </div>
                <div style={{ color: "#aaa", fontSize: "14px" }}>
                  Placed on: {new Date(order.created_at).toLocaleDateString()}
                </div>
                <div style={{ color: "#ccc", fontSize: "14px", marginTop: "5px" }}>
                  Items: {order.items?.length || 0} | Payment: {order.payment_method}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: `1px solid ${getStatusColor(order.status)}`,
                    color: getStatusColor(order.status),
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "inline-block",
                    marginBottom: "10px",
                  }}
                >
                  {order.status}
                </span>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff", marginBottom: "10px" }}>
                  ${order.grand_total}
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  style={{
                    background: "#222",
                    color: "#D4AF37",
                    border: "1px solid #D4AF37",
                    padding: "6px 16px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
