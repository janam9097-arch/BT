import api from "./api";

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post("/orders/", orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get("/orders/");
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.post(`/orders/${id}/cancel/`);
    return response.data;
  },

  returnOrder: async (id) => {
    const response = await api.post(`/orders/${id}/return/`);
    return response.data;
  },

  createPaymentIntent: async (orderId, paymentMethod) => {
    const response = await api.post("/payments/create-intent/", {
      order_id: orderId,
      payment_method: paymentMethod,
    });
    return response.data;
  },

  verifyPayment: async (paymentId, transactionId, status) => {
    const response = await api.post("/payments/verify/", {
      payment_id: paymentId,
      transaction_id: transactionId,
      status,
    });
    return response.data;
  }
};
