import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "../../services/orderService";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancel = async () => {
    try {
      const res = await orderService.cancelOrder(id);
      setActionMsg(res.message);
      await fetchOrder();
    } catch (err) {
      setActionMsg(err.response?.data?.error || "Cannot cancel order.");
    }
  };

  const handleReturn = async () => {
    try {
      const res = await orderService.returnOrder(id);
      setActionMsg(res.message);
      await fetchOrder();
    } catch (err) {
      setActionMsg(err.response?.data?.error || "Cannot return order.");
    }
  };

  if (loading) {
    return (
      <div style={{ color: "#D4AF37", padding: "100px 20px", textAlign: "center" }}>Loading order details...</div>
    );
  }

  if (!order) {
    return (
      <div style={{ color: "#fff", padding: "100px 20px", textAlign: "center" }}>Order not found.</div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "20px", marginBottom: "30px" }}>
        <div>
          <h2 style={{ color: "#D4AF37", margin: "0 0 5px 0" }}>Order #{order.order_number}</h2>
          <p style={{ color: "#aaa", margin: 0 }}>Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>
        <div>
          <span
            style={{
              background: "#D4AF37",
              color: "#000",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {order.status}
          </span>
        </div>
      </div>

      {actionMsg && (
        <div style={{ background: "rgba(212,175,55,0.2)", border: "1px solid #D4AF37", color: "#D4AF37", padding: "12px", borderRadius: "6px", marginBottom: "25px" }}>
          {actionMsg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "30px" }}>
        {/* Shipping Info */}
        <div style={{ background: "#111", padding: "20px", borderRadius: "8px", border: "1px solid #333" }}>
          <h4 style={{ color: "#D4AF37", marginTop: 0 }}>Shipping Address</h4>
          <p style={{ margin: "4px 0", fontWeight: "bold" }}>{order.shipping_name}</p>
          <p style={{ margin: "4px 0", color: "#ccc" }}>{order.shipping_address}</p>
          <p style={{ margin: "4px 0", color: "#ccc" }}>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
          <p style={{ margin: "4px 0", color: "#ccc" }}>Phone: {order.shipping_phone}</p>
        </div>

        {/* Payment Info */}
        <div style={{ background: "#111", padding: "20px", borderRadius: "8px", border: "1px solid #333" }}>
          <h4 style={{ color: "#D4AF37", marginTop: 0 }}>Payment Information</h4>
          <p style={{ margin: "4px 0" }}><strong>Method:</strong> {order.payment_method}</p>
          <p style={{ margin: "4px 0" }}><strong>Status:</strong> <span style={{ color: order.payment_status === "COMPLETED" ? "#4caf50" : "#ff9800" }}>{order.payment_status}</span></p>
          <p style={{ margin: "4px 0" }}><strong>Grand Total:</strong> <span style={{ color: "#D4AF37", fontSize: "18px", fontWeight: "bold" }}>${order.grand_total}</span></p>
        </div>
      </div>

      {/* Ordered Items */}
      <h3 style={{ color: "#D4AF37", marginBottom: "15px" }}>Ordered Items</h3>
      <div style={{ background: "#111", borderRadius: "8px", border: "1px solid #333", padding: "20px", marginBottom: "30px" }}>
        {order.items?.map((item) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "20px", padding: "10px 0", borderBottom: "1px solid #222" }}>
            <img
              src={item.product_image || "https://picsum.photos/100"}
              alt={item.product_name}
              style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px" }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 5px 0" }}>{item.product_name}</h4>
              <p style={{ margin: 0, color: "#aaa", fontSize: "14px" }}>
                ${item.price} x {item.quantity}
              </p>
            </div>
            <div style={{ color: "#D4AF37", fontWeight: "bold", fontSize: "16px" }}>
              ${item.total_price}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
        <Link to="/orders" style={{ background: "#222", color: "#fff", padding: "12px 24px", borderRadius: "6px", textDecoration: "none" }}>
          Back to Orders
        </Link>
        {["PENDING", "PROCESSING"].includes(order.status) && (
          <button
            onClick={handleCancel}
            style={{ background: "#ff4d4f", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            Cancel Order
          </button>
        )}
        {order.status === "DELIVERED" && (
          <button
            onClick={handleReturn}
            style={{ background: "#9c27b0", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            Request Return
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
