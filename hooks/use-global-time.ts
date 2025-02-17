import { create } from "zustand";

interface useGlobalTimeProps {
  currentTime: Date;
  setTime: (time: Date) => void;
}

export const useGlobalTime = create<useGlobalTimeProps>((set) => ({
  currentTime: new Date(),
  setTime: (time) => {
    set((state) => ({ currentTime: time }));
  },
}));
