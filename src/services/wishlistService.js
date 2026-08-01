import api from "./api";

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get("/wishlist/");
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await api.post("/wishlist/add/", { product_id: productId });
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/remove/${productId}/`);
    return response.data;
  }
};
