import { create } from "zustand";

interface useAddHostelStoreProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setIsOpen: (value: boolean) => void;
}

export const useAddHostelStore = create<useAddHostelStoreProps>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setIsOpen: (value: boolean) => set({ isOpen: value }),
}));
