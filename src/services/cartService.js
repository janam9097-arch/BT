import api from "./api";

export const cartService = {
  getCart: async () => {
    const response = await api.get("/cart/");
    return response.data;
  },

  addToCart: async (productId, variantId = null, quantity = 1) => {
    const response = await api.post("/cart/add/", {
      product_id: productId,
      variant_id: variantId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await api.patch(`/cart/update/${itemId}/`, { quantity });
    return response.data;
  },

  removeCartItem: async (itemId) => {
    const response = await api.delete(`/cart/remove/${itemId}/`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.post("/cart/clear/");
    return response.data;
  },

  applyCoupon: async (code) => {
    const response = await api.post("/coupons/apply/", { code });
    return response.data;
  },

  removeCoupon: async () => {
    const response = await api.post("/coupons/remove/");
    return response.data;
  }
};
