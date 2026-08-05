import React, { createContext, useState, useEffect, useContext } from "react";
import { cartService } from "../services/cartService";
import { mockProducts } from "../data/mockProducts";

const CartContext = createContext();

const LOCAL_STORAGE_KEY = "luxury_ecommerce_cart";

const calculateCartTotals = (items, couponCode = null) => {
  const subtotalVal = items.reduce((acc, item) => {
    const price = parseFloat(
      item.unit_price ||
      item.product?.discount_price ||
      item.product?.price ||
      0
    );
    return acc + price * (item.quantity || 1);
  }, 0);

  let discountVal = 0;
  if (couponCode && couponCode.trim().toUpperCase() === "GOLD20") {
    discountVal = subtotalVal * 0.20;
  }

  const taxableSubtotal = Math.max(0, subtotalVal - discountVal);
  const taxVal = Math.round(taxableSubtotal * 0.05 * 100) / 100;
  const shippingVal = subtotalVal >= 100 || items.length === 0 ? 0 : 10.0;
  const grandTotalVal = Math.max(0, subtotalVal - discountVal + taxVal + shippingVal);

  return {
    id: "local_cart",
    items,
    coupon_code: couponCode,
    subtotal: subtotalVal.toFixed(2),
    discount_amount: discountVal.toFixed(2),
    tax_amount: taxVal.toFixed(2),
    shipping_cost: shippingVal.toFixed(2),
    grand_total: grandTotalVal.toFixed(2),
  };
};

const getInitialLocalCart = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items)) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load local cart from localStorage:", e);
  }
  return calculateCartTotals([]);
};

const saveLocalCart = (cartData) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartData));
  } catch (e) {
    console.warn("Failed to save local cart to localStorage:", e);
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => getInitialLocalCart());
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        setCart(data);
        saveLocalCart(data);
      } else {
        const local = getInitialLocalCart();
        setCart(local);
      }
    } catch (e) {
      console.warn("Cart load error from backend, using local storage cart:", e);
      setCart(getInitialLocalCart());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, variantId = null, quantity = 1, productObj = null) => {
    let updatedCart = null;
    try {
      updatedCart = await cartService.addToCart(productId, variantId, quantity);
      if (updatedCart && Array.isArray(updatedCart.items)) {
        setCart(updatedCart);
        saveLocalCart(updatedCart);
        return updatedCart;
      }
    } catch (e) {
      console.warn("Backend addToCart failed or unavailable, using local cart fallback:", e);
    }

    // Local cart fallback logic
    const currentCart = cart || getInitialLocalCart();
    let currentItems = [...(currentCart.items || [])];

    let existingIndex = currentItems.findIndex(
      (item) =>
        (item.product_id === productId ||
          item.product?.id === productId ||
          String(item.product_id) === String(productId) ||
          String(item.product?.id) === String(productId) ||
          item.product?.slug === productId) &&
        (variantId ? item.variant_id === variantId || item.variant?.id === variantId : true)
    );

    if (existingIndex > -1) {
      const existing = currentItems[existingIndex];
      const newQty = (existing.quantity || 1) + quantity;
      const unitPrice = parseFloat(
        existing.unit_price || existing.product?.discount_price || existing.product?.price || 0
      );
      currentItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        total_price: (unitPrice * newQty).toFixed(2),
      };
    } else {
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

      const unitPrice = parseFloat(prod.discount_price || prod.price || 0);
      const newItem = {
        id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        product: prod,
        product_id: prod.id,
        variant: null,
        variant_id: variantId,
        quantity: quantity,
        unit_price: unitPrice.toFixed(2),
        total_price: (unitPrice * quantity).toFixed(2),
      };
      currentItems.push(newItem);
    }

    updatedCart = calculateCartTotals(currentItems, currentCart.coupon_code);
    setCart(updatedCart);
    saveLocalCart(updatedCart);
    return updatedCart;
  };

  const updateQuantity = async (itemId, quantity) => {
    let updatedCart = null;
    try {
      updatedCart = await cartService.updateCartItem(itemId, quantity);
      if (updatedCart && Array.isArray(updatedCart.items)) {
        setCart(updatedCart);
        saveLocalCart(updatedCart);
        return updatedCart;
      }
    } catch (e) {
      console.warn("Backend updateQuantity failed, using local fallback:", e);
    }

    const currentCart = cart || getInitialLocalCart();
    let currentItems = [...(currentCart.items || [])];

    if (quantity <= 0) {
      currentItems = currentItems.filter((item) => item.id !== itemId);
    } else {
      currentItems = currentItems.map((item) => {
        if (item.id === itemId) {
          const unitPrice = parseFloat(
            item.unit_price || item.product?.discount_price || item.product?.price || 0
          );
          return {
            ...item,
            quantity: quantity,
            total_price: (unitPrice * quantity).toFixed(2),
          };
        }
        return item;
      });
    }

    updatedCart = calculateCartTotals(currentItems, currentCart.coupon_code);
    setCart(updatedCart);
    saveLocalCart(updatedCart);
    return updatedCart;
  };

  const removeFromCart = async (itemId) => {
    let updatedCart = null;
    try {
      updatedCart = await cartService.removeCartItem(itemId);
      if (updatedCart && Array.isArray(updatedCart.items)) {
        setCart(updatedCart);
        saveLocalCart(updatedCart);
        return updatedCart;
      }
    } catch (e) {
      console.warn("Backend removeFromCart failed, using local fallback:", e);
    }

    const currentCart = cart || getInitialLocalCart();
    const currentItems = (currentCart.items || []).filter((item) => item.id !== itemId);

    updatedCart = calculateCartTotals(currentItems, currentCart.coupon_code);
    setCart(updatedCart);
    saveLocalCart(updatedCart);
    return updatedCart;
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
    } catch (e) {
      console.warn("Backend clearCart failed:", e);
    }

    const emptyCart = calculateCartTotals([]);
    setCart(emptyCart);
    saveLocalCart(emptyCart);
    return emptyCart;
  };

  const applyCoupon = async (code) => {
    try {
      const res = await cartService.applyCoupon(code);
      if (res && res.cart) {
        setCart(res.cart);
        saveLocalCart(res.cart);
        return res;
      }
    } catch (e) {
      console.warn("Backend applyCoupon failed, using local fallback:", e);
    }

    const currentCart = cart || getInitialLocalCart();
    if (code.trim().toUpperCase() === "GOLD20") {
      const updatedCart = calculateCartTotals(currentCart.items || [], "GOLD20");
      setCart(updatedCart);
      saveLocalCart(updatedCart);
      return { cart: updatedCart, message: "20% Discount Coupon Applied!" };
    } else {
      throw { response: { data: { error: "Invalid coupon code. Try GOLD20." } } };
    }
  };

  const removeCoupon = async () => {
    try {
      const res = await cartService.removeCoupon();
      if (res && res.cart) {
        setCart(res.cart);
        saveLocalCart(res.cart);
        return res;
      }
    } catch (e) {
      console.warn("Backend removeCoupon failed:", e);
    }

    const currentCart = cart || getInitialLocalCart();
    const updatedCart = calculateCartTotals(currentCart.items || [], null);
    setCart(updatedCart);
    saveLocalCart(updatedCart);
    return { cart: updatedCart, message: "Coupon removed." };
  };

  const cartCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

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
