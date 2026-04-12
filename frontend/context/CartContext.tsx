"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  pricePerCan: number;
  image?: {
    url: string;
  };
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function getCartStorageKey() {
  if (typeof window === "undefined") return "cart_guest";

  const token = window.localStorage.getItem("token");
  const userRaw = window.localStorage.getItem("user");

  if (!token || !userRaw) {
    return "cart_guest";
  }

  try {
    const user = JSON.parse(userRaw);
    const userId = user.id || user.username || user.email || "guest";
    return `cart_${userId}`;
  } catch {
    return "cart_guest";
  }
}

function loadCartFromStorage(key: string): CartItem[] {
  if (typeof window === "undefined") return [];

  const savedCart = window.localStorage.getItem(key);
  return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [storageKey, setStorageKey] = useState<string>(() =>
    getCartStorageKey(),
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadCartFromStorage(getCartStorageKey()),
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  useEffect(() => {
    const syncCartWithAuth = () => {
      const newKey = getCartStorageKey();
      setStorageKey(newKey);
      setCartItems(loadCartFromStorage(newKey));
    };

    syncCartWithAuth();

    window.addEventListener("auth-changed", syncCartWithAuth);
    window.addEventListener("storage", syncCartWithAuth);

    return () => {
      window.removeEventListener("auth-changed", syncCartWithAuth);
      window.removeEventListener("storage", syncCartWithAuth);
    };
  }, []);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
