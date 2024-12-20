import { useOrderModal } from "@/hooks/clothing/use-order-modal";
import { ResponsiveModal } from "../responsive-modal";
import { OrderItemDescription } from "@/app/(protected)/student/new-order/_components/order-item-description";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useClothingItemsStore } from "@/hooks/clothing/clothingItems/use-clothing-items-store";
import { ClothingItem } from "@prisma/client";
import { usePostClothes } from "@/hooks/clothing/use-post-clothes";
import { useEffect } from "react";

interface OrderModalProps {
  clothingItems: ClothingItem[];
  setIsOrderPending: (val: boolean) => void;
}

export const OrderModal = ({
  clothingItems,
  setIsOrderPending,
}: OrderModalProps) => {
  const { items, reset } = useClothingItemsStore();
  const { isOpen, setIsOpen, close } = useOrderModal();
  const { mutate, isPending } = usePostClothes();

  useEffect(() => {
    setIsOrderPending(isPending);
  }, [isPending, setIsOrderPending]);

  const handlePlaceOrder = () => {
    if (!clothingItems) return;
    const clothingItemIdWithQty = items.map((item) => {
      const itemId = clothingItems.find(
        (cloth) => cloth.name === item.item_name
      )?.id;
      return {
        itemId,
        quantity: item.quantity,
      };
    });
    const totalClothes = items.reduce((acc, curr) => (acc += curr.quantity), 0);
    if (clothingItemIdWithQty && totalClothes) {
      mutate(
        { clothingItemIdWithQty, total_quantity: totalClothes },
        {
          onSuccess: () => {
            close();
            reset();
          },
        }
      );
    } else {
      return;
    }
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <Card className="shadow-none size-full border-none">
        <CardHeader className="p-4">
          <CardTitle className="md:text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-x-4">
          <OrderItemDescription />
          <div className="flex items-center justify-end gap-x-4 mt-4">
            <Button
              variant="outline"
              className="border-amber-600"
              onClick={close}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handlePlaceOrder} disabled={isPending}>
              Place Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
