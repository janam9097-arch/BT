import api from "./api";
import categories from "../data/categories";

export const categoryService = {
  getCategories: async (all = false) => {
    try {
      const response = await api.get("/categories/", { params: { all } });
      if (response.data && (response.data.results?.length > 0 || (Array.isArray(response.data) && response.data.length > 0))) {
        return response.data;
      }
    } catch (_err) {
      console.warn("Backend unavailable, using static categories fallback.");
    }
    return { results: categories };
  },

  getCategoryBySlug: async (slug) => {
    try {
      const response = await api.get(`/categories/${slug}/`);
      if (response.data) return response.data;
    } catch (_err) {
      console.warn("Backend unavailable, using static category slug fallback.");
    }
    const found = categories.find((c) => c.slug === slug || String(c.id) === String(slug));
    return found || categories[0];
  },
};
