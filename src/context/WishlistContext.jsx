import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { wishlistService } from "../services/wishlistService";
import { useAuth } from "./AuthContext";
import { mockProducts } from "../data/mockProducts";

const WishlistContext = createContext();
const WISHLIST_STORAGE_KEY = "luxury_ecommerce_wishlist";

const getInitialLocalWishlist = () => {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Failed to read wishlist from localStorage:", e);
  }
  return [];
};

const saveLocalWishlist = (items) => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Failed to save wishlist to localStorage:", e);
  }
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => getInitialLocalWishlist());
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const data = await wishlistService.getWishlist();
        const items = data.results || data || [];
        if (Array.isArray(items) && items.length > 0) {
          setWishlist(items);
          saveLocalWishlist(items);
          return;
        }
      } catch (e) {
        console.warn("Backend wishlist load error, using local fallback:", e);
      } finally {
        setLoading(false);
      }
    }
    setWishlist(getInitialLocalWishlist());
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId, productObj = null) => {
    if (isAuthenticated) {
      try {
        await wishlistService.addToWishlist(productId);
        await fetchWishlist();
        return true;
      } catch (e) {
        console.warn("Backend addToWishlist error, using local fallback:", e);
      }
    }

    // Local fallback for unauthenticated users or when backend fails
    let prod = productObj;
    if (!prod) {
      prod = mockProducts.find(
        (p) => p.id === productId || p.slug === productId || String(p.id) === String(productId)
      );
    }
    if (!prod) {
      prod = {
        id: productId,
        title: typeof productId === "string" ? productId : `Product #${productId}`,
        price: "99.99",
        discount_price: "99.99",
        primary_image: "https://picsum.photos/400",
      };
    }

    let current = [...wishlist];
    const exists = current.some(
      (item) =>
        String(item.product?.id || item.product_id || item.id) === String(productId) ||
        (item.product?.slug && item.product.slug === productId) ||
        (item.slug && item.slug === productId)
    );

    if (!exists) {
      const newItem = {
        id: `local_w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        product: prod,
        product_id: prod.id,
      };
      current.push(newItem);
      setWishlist(current);
      saveLocalWishlist(current);
    }
    return true;
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        await wishlistService.removeFromWishlist(productId);
        await fetchWishlist();
        return;
      } catch (e) {
        console.warn("Backend removeFromWishlist error, using local fallback:", e);
      }
    }

    const filtered = wishlist.filter(
      (item) =>
        String(item.product?.id || item.product_id || item.id) !== String(productId) &&
        item.product?.slug !== productId &&
        item.slug !== productId
    );
    setWishlist(filtered);
    saveLocalWishlist(filtered);
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some(
      (item) =>
        String(item.product?.id || item.product_id || item.id) === String(productId) ||
        (item.product?.slug && item.product.slug === productId) ||
        (item.slug && item.slug === productId)
    );
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
