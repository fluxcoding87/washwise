import { ResponsiveModal } from "@/components/responsive-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useViewItemDetails } from "@/hooks/placed-orders/use-view-item-details";
import { useGetLaundryById } from "@/hooks/clothing/use-get-laundry-by-id";
import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusIcon from "./status-icon";
import { useConfirmOrderByStudent } from "@/hooks/placed-orders/use-confirm-order-by-student";
import { createPortal } from "react-dom";
import { LaundryWithClothes } from "@/types/clothing";

interface OrderItemModalProps {
  laundry: LaundryWithClothes;
  status: string;
}

export const OrderItemModal = ({ laundry, status }: OrderItemModalProps) => {
  const { open, setIsOpen, close, modals } = useViewItemDetails();
  const { mutate, isPending } = useConfirmOrderByStudent();
  const { data: clothingItems, isLoading } = useGetClothingItems();

  if (!laundry || !clothingItems) {
    return null;
  }
  const handleClick = () => {
    mutate(
      { laundryId: laundry.id },
      {
        onSuccess: () => {
          close(laundry.id);
        },
      }
    );
  };
  const root = document.getElementById("root");
  return createPortal(
    <ResponsiveModal
      onOpenChange={(val) => setIsOpen(laundry.id, val)}
      open={modals[laundry.id] || false}
      laundryId={laundry.id}
    >
      {/* {isLoading ? (
        <div className="flex items-center justify-center w-full h-32">
          <Loader2 className="animate-spin" />
        </div>
      ) : ( */}
      <Card className="size-full border-none shadow-none">
        <CardHeader>
          <CardTitle className="tracking-wide leading-normal text-lg">
            Laundry Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="shadow-md">
            <TableHeader>
              <TableRow className="text-base border-b border-primary">
                <TableHead className="font-bold text-neutral-800 w-[50%]">
                  Items
                </TableHead>
                <TableHead className="font-bold text-neutral-800 w-[50%]">
                  Quantity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laundry.clothes.clothingItems.map((item) => {
                const name = clothingItems.find(
                  (val) => val.id === item.clothingItemId
                )?.name;
                return (
                  <TableRow key={item.clothingItemId} className="font-medium">
                    <TableCell>{name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="font-bold">
                <TableCell className="text-base md:text-lg">
                  Total Quantity
                </TableCell>
                <TableCell className="text-base md:text-lg">
                  {laundry.total_quantity}{" "}
                  {laundry.total_quantity === 1 ? "Item" : "Clothes"}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter>
          {status !== "awaitingPickup" && (
            <div
              className={cn(
                "flex relative items-center justify-center w-full bg-red-300 rounded-md hover:bg-red-400 cursor-pointer transition",
                status === "processing" && "bg-yellow-200 hover:bg-yellow-300",
                status === "completed" && "bg-green-200 hover:bg-green-300"
              )}
            >
              <StatusIcon status={status} />
            </div>
          )}
          {status === "awaitingPickup" && (
            <Button
              type="button"
              onClick={handleClick}
              size="lg"
              className="w-full font-semibold text-lg h-14"
              disabled={isPending}
            >
              <CheckCircle2 className="size-5" />
              Recieve Order
            </Button>
          )}
        </CardFooter>
      </Card>
    </ResponsiveModal>,
    root!
  );
};
