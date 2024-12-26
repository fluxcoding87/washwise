import { create } from "zustand";

interface UseSelectedOrderStoreProps {
  laundryId: string | undefined;
  add: (id: string) => void;
  remove: () => void;
}

export const useSelectedOrderStore = create<UseSelectedOrderStoreProps>(
  (set) => ({
    laundryId: undefined,
    add: (id: string) => set({ laundryId: id }),
    remove: () => set({ laundryId: undefined }),
  })
);
