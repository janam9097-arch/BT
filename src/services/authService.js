import supabase from "./supabaseClient";
import api from "./api";

export const authService = {
  // --- Supabase Authentication ---

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // Sync user to Django backend
    await authService.syncUserToBackend(data.user);
    return data;
  },

  loginWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  register: async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          username: userData.username || "",
        },
      },
    });
    if (error) throw error;
    // Sync user to Django backend if signup is confirmed (no email verification)
    if (data.user && !data.user.identities?.length === 0) {
      await authService.syncUserToBackend(data.user);
    }
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error", error);
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  forgotPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
    return { message: "Password reset instructions have been sent to your email." };
  },

  // --- Django Backend Profile Sync ---

  syncUserToBackend: async (supabaseUser) => {
    try {
      await api.post("/users/supabase-sync/", {
        supabase_id: supabaseUser.id,
        email: supabaseUser.email,
        first_name:
          supabaseUser.user_metadata?.first_name ||
          supabaseUser.user_metadata?.full_name?.split(" ")[0] ||
          "",
        last_name:
          supabaseUser.user_metadata?.last_name ||
          supabaseUser.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
          "",
        username:
          supabaseUser.user_metadata?.username ||
          supabaseUser.email.split("@")[0],
        avatar_url: supabaseUser.user_metadata?.avatar_url || "",
      });
    } catch (e) {
      // Don't block login if sync fails — user can still browse
      console.warn("Backend user sync failed:", e);
    }
  },

  // --- Django Backend Profile APIs (unchanged) ---

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
};
