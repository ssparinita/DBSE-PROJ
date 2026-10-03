import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API = "http://localhost:8081";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // =========================================================
  // AUTH
  // =========================================================

  const loadUser = async () => {
    try {
      const response = await fetch(`${API}/api/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      if (data.authenticated) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signIn = () => {
    window.location.href =
      `${API}/oauth2/authorization/google?prompt=select_account`;
  };

  const signOut = async () => {
    try {
      await fetch(`${API}/logout`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    setUser(null);
    setCartItems([]);
    setCartTotal(0);

    window.location.href = "/";
  };

  // =========================================================
  // CART
  // =========================================================

  const loadCart = async () => {
    if (!user) {
      setCartItems([]);
      setCartTotal(0);
      return;
    }

    setLoadingCart(true);

    try {
      const response = await fetch(`${API}/api/cart`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load cart");
      }

      const data = await response.json();

      setCartItems(Array.isArray(data.items) ? data.items : []);
      setCartTotal(Number(data.total || 0));
    } catch (error) {
      console.error("Cart loading error:", error);
      setCartItems([]);
      setCartTotal(0);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      signIn();
      return;
    }

    try {
      const response = await fetch(`${API}/api/cart/items`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: Number(productId),
          quantity: Number(quantity),
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to add product");
      }

      await loadCart();
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Could not add this product to your cart.");
    }
  };

  // =========================================================
  // UPDATE CART ITEM
  // =========================================================

  const updateQty = async (cartItemId, quantity) => {
    const newQuantity = Number(quantity);

    try {
      const response = await fetch(
        `${API}/api/cart/items/${cartItemId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to update cart");
      }

      await loadCart();
    } catch (error) {
      console.error("Cart update failed:", error);
      alert("Could not update the cart.");
    }
  };

  // =========================================================
  // REMOVE CART ITEM
  // =========================================================

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(
        `${API}/api/cart/items/${cartItemId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to remove item");
      }

      await loadCart();
    } catch (error) {
      console.error("Remove from cart failed:", error);
      alert("Could not remove this item.");
    }
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = async () => {
    try {
      const items = [...cartItems];

      await Promise.all(
        items.map((item) =>
          fetch(`${API}/api/cart/items/${item.id}`, {
            method: "DELETE",
            credentials: "include",
          })
        )
      );

      await loadCart();
    } catch (error) {
      console.error("Clear cart failed:", error);
    }
  };

  // =========================================================
  // CART COUNT
  // =========================================================

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  // =========================================================
  // CONTEXT
  // =========================================================

  const value = {
    user,
    setUser,

    authLoading,

    signIn,
    signOut,
    loadUser,

    cartItems,
    cartTotal,
    cartCount,
    loadingCart,

    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    loadCart,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);