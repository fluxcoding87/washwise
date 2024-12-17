"use client";
import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Header</DialogTitle>
        </DialogHeader>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerHeader className="sr-only">
        <DrawerTitle className="sr-only">Header</DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
