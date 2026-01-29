import { create } from "zustand";
import { CartState } from "@/types/cart";
import { getAccessToken } from "@/lib/authClient";

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product, qty = 1) => {
    const existing = get().items.find(
      (item) => item.product._id === product._id
    );

    if (existing) {
      set({
        items: get().items.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        ),
      });
    } else {
      set({
        items: [...get().items, { product, quantity: qty }],
      });
    }

    // Dispatch cart update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // persist guest cart to localStorage (product objects only)
    if (typeof window !== "undefined") {
      try {
        const toSave = get()
          .items.map((it: any) => ({ ...it.product, quantity: it.quantity }));
        localStorage.setItem("cart", JSON.stringify(toSave));
      } catch {}
    }

    const token = getAccessToken();
    if (!token) {
      // only signed-in users can add to cart
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return;
    }

    if (typeof window !== "undefined") {
      (async () => {
        try {
          await fetch("/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId: product._id, quantity: qty }),
          });
        } catch (err) {
          console.error("Failed to sync addToCart with server:", err);
        }
      })();
    }
  },

  removeFromCart: (productId) => {
    set({
      items: get().items.filter(
        (item) => item.product._id !== productId
      ),
    });

    // Dispatch cart update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    if (typeof window !== "undefined") {
      try {
        const toSave = get().items.map((it: any) => ({ ...it.product, quantity: it.quantity }));
        localStorage.setItem("cart", JSON.stringify(toSave));
      } catch {}
    }
  },

  updateQuantity: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set({
      items: get().items.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: qty }
          : item
      ),
    });

    // Dispatch cart update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    if (typeof window !== "undefined") {
      try {
        const toSave = get().items.map((it: any) => ({ ...it.product, quantity: it.quantity }));
        localStorage.setItem("cart", JSON.stringify(toSave));
      } catch {}
    }
  },

  clearCart: () => {
    set({ items: [] });
    
    // Dispatch cart update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem('cart');
      } catch {}
    }
  },

  totalItems: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () =>
    get().items.reduce(
      (sum, item) =>
        sum +
        item.quantity *
          (item.product.discountPrice ??
            item.product.price),
      0
    ),
}));

// initialize store from server (if logged in) or localStorage
if (typeof window !== "undefined") {
  (async () => {
    try {
      const token = getAccessToken();
      if (token) {
        const res = await fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data?.success && data.cart?.items) {
          const items = data.cart.items.map((it: any) => ({ product: it.product, quantity: it.quantity }));
          useCartStore.setState({ items });
          return;
        }
      }

      const saved = JSON.parse(localStorage.getItem('cart') || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        // saved items are product objects with quantity
        const items = saved.map((p: any) => ({ product: p, quantity: p.quantity || 1 }));
        useCartStore.setState({ items });
      }
    } catch (err) {
      console.error('Failed to initialize cart store', err);
    }
  })();
}
