import { create } from "zustand";

interface ClothingItemsStore {
  items: { item_name: string; quantity: number }[];
  addItems: (item_name: string) => void;
  increment_item: (item_name: string) => void;
  decrement_item: (item_name: string) => void;
  reset: () => void;
}

export const useClothingItemsStore = create<ClothingItemsStore>((set) => ({
  items: [],

  // Add an item if it doesn't exist, otherwise increment its quantity
  addItems: (item_name) =>
    set((state) => {
      const itemIndex = state.items.findIndex(
        (item) => item.item_name === item_name
      );
      if (itemIndex === -1) {
        return { items: [...state.items, { item_name, quantity: 1 }] };
      } else {
        const updatedItems = [...state.items];
        updatedItems[itemIndex].quantity += 1;
        return { items: updatedItems };
      }
    }),

  // Increment the quantity of the existing item
  increment_item: (item_name) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.item_name === item_name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return { items: updatedItems };
    }),

  // Decrement the quantity of the existing item
  decrement_item: (item_name) =>
    set((state) => {
      const updatedItems = state.items
        .map((item) =>
          item.item_name === item_name && item.quantity > 0
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with quantity 0

      return { items: updatedItems };
    }),

  // Reset the store (clear all items)
  reset: () => set({ items: [] }),
}));
