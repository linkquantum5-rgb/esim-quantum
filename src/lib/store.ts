import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Plan } from './types';

interface CartStore {
  items: CartItem[];
  addItem: (plan: Plan) => void;
  removeItem: (planId: string) => void;
  updateQuantity: (planId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (plan) => {
        const items = get().items;
        const existingItem = items.find((item) => item.plan.id === plan.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.plan.id === plan.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { plan, quantity: 1 }] });
        }
      },
      removeItem: (planId) => {
        set({ items: get().items.filter((item) => item.plan.id !== planId) });
      },
      updateQuantity: (planId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(planId);
        } else {
          set({
            items: get().items.map((item) =>
              item.plan.id === planId ? { ...item, quantity } : item
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.plan.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'eSIM Quantum-cart',
    }
  )
);
