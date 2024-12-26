"use client";
import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { useViewItemDetails } from "@/hooks/placed-orders/use-view-item-details";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  laundryId?: string;
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
  laundryId,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const { modals, setIsOpen, close } = useViewItemDetails();
  const handleOpenChange = (open: boolean) => {
    if (laundryId) {
      setIsOpen(laundryId, open);
    }
  };
  const handleClose = () => {
    if (laundryId) {
      setIsOpen(laundryId, false);
    }
  };
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Header</DialogTitle>
        </DialogHeader>
        <DialogContent
          onClose={handleClose}
          className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]"
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
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
