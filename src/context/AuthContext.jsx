import React, { createContext, useState, useEffect, useContext } from "react";
import supabase from "../services/supabaseClient";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Django backend profile for cart/orders/address data
  const fetchBackendProfile = async () => {
    try {
      const profileData = await authService.getProfile();
      setProfile(profileData);
    } catch (e) {
      console.warn("Backend profile fetch failed:", e);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUser(data.session.user);
          await authService.syncUserToBackend(data.session.user);
          await fetchBackendProfile();
        }
      } catch (e) {
        console.error("Auth init error:", e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes (login, logout, OAuth callback, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          await authService.syncUserToBackend(session.user);
          await fetchBackendProfile();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    return data;
  };

  const loginWithGoogle = async () => {
    return await authService.loginWithGoogle();
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
  };

  const refreshUser = async () => {
    try {
      const supabaseUser = await authService.getUser();
      setUser(supabaseUser);
      await fetchBackendProfile();
    } catch (e) {
      console.error("Refresh user error:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
