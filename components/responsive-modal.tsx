"use client";
import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { useViewItemDetails } from "@/hooks/placed-orders/use-view-item-details";
import { useMissingItems } from "@/hooks/plant-staff/use-missing-item-store";
import { useEffect } from "react";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  laundryId?: string;
  type?: "missingItem" | "item";
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
  laundryId,
  type = "item",
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const { setIsOpen, modals: itemModals } = useViewItemDetails();
  const { setIsOpen: setMissingModalOpen, modals } = useMissingItems();
  const handleOpenChange = (open: boolean) => {
    if (laundryId && type === "item") {
      setIsOpen(laundryId, open);
    } else if (laundryId && type === "missingItem") {
      setMissingModalOpen(laundryId, open);
    }
  };
  const handleClose = () => {
    if (laundryId && type === "item") {
      setIsOpen(laundryId, false);
    } else if (laundryId && type === "missingItem") {
      setMissingModalOpen(laundryId, false);
    }
  };
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      document.body.style.pointerEvents = "auto";
    };
  }, [modals]);
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
