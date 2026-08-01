import api from "./api";

export const categoryService = {
  getCategories: async (all = false) => {
    const response = await api.get("/categories/", { params: { all } });
    return response.data;
  },

  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}/`);
    return response.data;
  }
};
