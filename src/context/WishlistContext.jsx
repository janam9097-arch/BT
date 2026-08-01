import React, { createContext, useState, useEffect, useContext } from "react";
import { wishlistService } from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data.results || data || []);
    } catch (e) {
      console.error("Wishlist error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) return false;
    await wishlistService.addToWishlist(productId);
    await fetchWishlist();
    return true;
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return;
    await wishlistService.removeFromWishlist(productId);
    await fetchWishlist();
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.product?.id === productId || item.product_id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
