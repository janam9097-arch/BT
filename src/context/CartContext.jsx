import React, { createContext, useState, useEffect, useContext } from "react";
import { cartService } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (e) {
      console.error("Cart load error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, variantId = null, quantity = 1) => {
    const updated = await cartService.addToCart(productId, variantId, quantity);
    setCart(updated);
  };

  const updateQuantity = async (itemId, quantity) => {
    const updated = await cartService.updateCartItem(itemId, quantity);
    setCart(updated);
  };

  const removeFromCart = async (itemId) => {
    const updated = await cartService.removeCartItem(itemId);
    setCart(updated);
  };

  const clearCart = async () => {
    const updated = await cartService.clearCart();
    setCart(updated);
  };

  const applyCoupon = async (code) => {
    const res = await cartService.applyCoupon(code);
    if (res.cart) {
      setCart(res.cart);
    }
    return res;
  };

  const removeCoupon = async () => {
    const res = await cartService.removeCoupon();
    if (res.cart) {
      setCart(res.cart);
    }
    return res;
  };

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
