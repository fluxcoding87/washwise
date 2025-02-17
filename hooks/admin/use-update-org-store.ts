import { create } from "zustand";

interface useUpdateOrgStoreProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setIsOpen: (value: boolean) => void;
}

export const useUpdateOrgStore = create<useUpdateOrgStoreProps>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setIsOpen: (value: boolean) => set({ isOpen: value }),
}));
