import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/users/login/", { email, password });
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/users/register/", userData);
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
    }
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await api.post("/users/logout/", { refresh: refreshToken });
      }
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  getProfile: async () => {
    const response = await api.get("/users/profile/");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch("/users/profile/", data);
    return response.data;
  },

  getAddresses: async () => {
    const response = await api.get("/users/addresses/");
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await api.post("/users/addresses/", addressData);
    return response.data;
  },

  updateAddress: async (id, addressData) => {
    const response = await api.put(`/users/addresses/${id}/`, addressData);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/users/addresses/${id}/`);
    return response.data;
  },

  changePassword: async (old_password, new_password) => {
    const response = await api.post("/users/change-password/", { old_password, new_password });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/users/forgot-password/", { email });
    return response.data;
  },

  resetPassword: async (email, code, new_password) => {
    const response = await api.post("/users/reset-password/", { email, code, new_password });
    return response.data;
  }
};
