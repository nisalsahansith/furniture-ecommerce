import { create } from "zustand";
import type { Product } from "../types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CART_STORAGE_KEY = "furniture-cart";

const loadCart = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    return JSON.parse(storedCart);
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),

  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      const items = existingItem
        ? state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { product, quantity: 1 }];

      saveCart(items);

      return { items };
    }),

  removeItem: (productId) =>
    set((state) => {
      const items = state.items.filter(
        (item) => item.product.id !== productId
      );

      saveCart(items);

      return { items };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const items =
        quantity <= 0
          ? state.items.filter(
              (item) => item.product.id !== productId
            )
          : state.items.map((item) =>
              item.product.id === productId
                ? { ...item, quantity }
                : item
            );

      saveCart(items);

      return { items };
    }),

  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    set({ items: [] });
  },

  getTotalItems: () =>
    get().items.reduce(
      (total, item) => total + item.quantity,
      0
    ),

  getTotalPrice: () =>
    get().items.reduce(
      (total, item) =>
        total + Number(item.product.price) * item.quantity,
      0
    ),
}));