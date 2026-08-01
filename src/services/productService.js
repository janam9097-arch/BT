import api from "./api";

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get("/products/", { params });
    return response.data;
  },

  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get("/products/featured/");
    return response.data;
  },

  getTrendingProducts: async () => {
    const response = await api.get("/products/trending/");
    return response.data;
  },

  getBestSellers: async () => {
    const response = await api.get("/products/best-sellers/");
    return response.data;
  },

  getNewArrivals: async () => {
    const response = await api.get("/products/new-arrivals/");
    return response.data;
  },

  getBrands: async () => {
    const response = await api.get("/products/brands/");
    return response.data;
  },

  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/?product=${productId}`);
    return response.data;
  },

  addReview: async (reviewData) => {
    const response = await api.post("/reviews/", reviewData);
    return response.data;
  }
};
