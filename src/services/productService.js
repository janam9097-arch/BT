import api from "./api";
import { mockProducts } from "../data/mockProducts";

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await api.get("/products/", { params });
      if (response.data && (response.data.results?.length > 0 || (Array.isArray(response.data) && response.data.length > 0))) {
        return response.data;
      }
    } catch {
      console.warn("Backend unavailable, using static products fallback.");
    }

    let list = [...mockProducts];
    if (params.category) {
      const cat = String(params.category).toLowerCase();
      list = list.filter(
        (p) =>
          p.category_slug?.toLowerCase().includes(cat) ||
          p.category_name?.toLowerCase().includes(cat)
      );
    }
    if (params.search) {
      const s = String(params.search).toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }
    return { count: list.length, next: null, previous: null, results: list };
  },

  getProductBySlug: async (slug) => {
    try {
      const response = await api.get(`/products/${slug}/`);
      if (response.data) return response.data;
    } catch {
      console.warn(`Backend unavailable for product ${slug}, using mock fallback.`);
    }
    const found = mockProducts.find(
      (p) => p.slug === slug || String(p.id) === String(slug)
    );
    return found || mockProducts[0];
  },

  getFeaturedProducts: async () => {
    try {
      const response = await api.get("/products/featured/");
      if (response.data && (response.data.results?.length > 0 || (Array.isArray(response.data) && response.data.length > 0))) {
        return response.data;
      }
    } catch {
      console.warn("Backend unavailable, using featured products fallback.");
    }
    const list = mockProducts.filter((p) => p.is_featured);
    return { results: list.length ? list : mockProducts };
  },

  getTrendingProducts: async () => {
    try {
      const response = await api.get("/products/trending/");
      if (response.data && (response.data.results?.length > 0 || (Array.isArray(response.data) && response.data.length > 0))) {
        return response.data;
      }
    } catch {
      console.warn("Backend unavailable, using trending products fallback.");
    }
    const list = mockProducts.filter((p) => p.is_trending);
    return { results: list.length ? list : mockProducts };
  },

  getBestSellers: async () => {
    try {
      const response = await api.get("/products/best-sellers/");
      if (response.data && (response.data.results?.length > 0 || (Array.isArray(response.data) && response.data.length > 0))) {
        return response.data;
      }
    } catch {
      console.warn("Backend unavailable, using best sellers fallback.");
    }
    const list = mockProducts.filter((p) => p.is_best_seller);
    return { results: list.length ? list : mockProducts };
  },

  getNewArrivals: async () => {
    try {
      const response = await api.get("/products/new-arrivals/");
      if (response.data && (response.data.results?.length > 0 || (Array.isArray(response.data) && response.data.length > 0))) {
        return response.data;
      }
    } catch {
      console.warn("Backend unavailable, using new arrivals fallback.");
    }
    const list = mockProducts.filter((p) => p.is_new_arrival);
    return { results: list.length ? list : mockProducts };
  },

  getBrands: async () => {
    try {
      const response = await api.get("/products/brands/");
      if (response.data) return response.data;
    } catch {
      console.warn("Backend unavailable, using brands fallback.");
    }
    return [
      { id: 1, name: "Gucci" },
      { id: 2, name: "Prada" },
      { id: 3, name: "Nike" },
      { id: 4, name: "Adidas" },
      { id: 5, name: "Rolex" },
      { id: 6, name: "Ray-Ban" },
    ];
  },

  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/reviews/?product=${productId}`);
      return response.data;
    } catch {
      return { results: [] };
    }
  },

  addReview: async (reviewData) => {
    try {
      const response = await api.post("/reviews/", reviewData);
      return response.data;
    } catch {
      return { id: Date.now(), ...reviewData };
    }
  },
};
