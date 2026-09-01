import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // product_id or variant_id
  productId: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  image?: string;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSummary: () => { subtotal: number; discount: number; total: number };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(Math.max(1, quantity), i.maxStock) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSummary: () => {
        const items = get().items;
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const discount = 0; // Implement discount logic later
        return { subtotal, discount, total: subtotal - discount };
      },
    }),
    {
      name: 'rajesh-cart',
    }
  )
);
