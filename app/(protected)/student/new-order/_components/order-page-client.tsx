"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";

import { CheckCircle2, Package, Loader2, TrashIcon } from "lucide-react";
import { FaCloud, FaCut, FaGraduationCap, FaTshirt } from "react-icons/fa";
import { AiOutlineLayout } from "react-icons/ai";
import {
  GiFeather,
  GiFoldedPaper,
  GiNecklaceDisplay,
  GiRolledCloth,
  GiShorts,
  GiWinterGloves,
  GiWinterHat,
} from "react-icons/gi";
import { BiSquare } from "react-icons/bi";
import { WiCloudy } from "react-icons/wi";

import { OrderItemAccordian } from "./order-item-accordian";
import { useCallback, useMemo, useState } from "react";
import { ClothingItem } from "@prisma/client";
import { OrderItemDescription } from "./order-item-description";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { useClothingItemsStore } from "@/hooks/clothing/clothingItems/use-clothing-items-store";
import { useConfirm } from "@/hooks/use-confirm";
import { OrderModal } from "@/components/order/order-modal";
import { useOrderModal } from "@/hooks/clothing/use-order-modal";
import { DayTime } from "@/components/day-time";

export const itemIconMap = [
  { name: "Blanket", icon: FaCloud },
  { name: "Bed Sheet", icon: AiOutlineLayout },
  { name: "Towel", icon: GiFoldedPaper },
  { name: "Pillow Cover", icon: BiSquare },
  { name: "Jean", icon: FaCut },
  { name: "Shirt", icon: FaTshirt },
  { name: "Lower", icon: GiRolledCloth },
  { name: "T-Shirt", icon: FaTshirt },
  { name: "Short", icon: GiShorts },
  { name: "Pant", icon: GiRolledCloth },
  { name: "Sweater", icon: WiCloudy },
  { name: "Jacket", icon: GiWinterGloves },
  { name: "School Sweater", icon: FaGraduationCap },
  { name: "Coat", icon: GiWinterHat },
  { name: "Scarve", icon: GiNecklaceDisplay },
  { name: "Salwaar", icon: GiRolledCloth },
  { name: "Kurta", icon: GiFeather },
];

export const OrderPageClient = () => {
  const [orderPending, setOrderPending] = useState<boolean>();
  const setIsOrderPending = useCallback((val: boolean) => {
    setOrderPending(val);
  }, []);

  const { open } = useOrderModal();
  const { data: clothingItems, isLoading } = useGetClothingItems();
  const { reset, items } = useClothingItemsStore();

  const currentDate = new Date();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action will reset the items you just added and cannot be undone."
  );

  const filterClothingByType = useCallback(
    (type: string): ClothingItem[] => {
      if (!clothingItems) return [];
      return clothingItems.filter((item) => item.type === type);
    },
    [clothingItems]
  );
  const topwearClothing = useMemo(
    () => filterClothingByType("topwear"),
    [filterClothingByType]
  );
  const bottomwearClothing = useMemo(
    () => filterClothingByType("bottomwear"),
    [filterClothingByType]
  );
  const outwearClothing = useMemo(
    () => filterClothingByType("outwear"),
    [filterClothingByType]
  );
  const householdItems = useMemo(
    () => filterClothingByType("household"),
    [filterClothingByType]
  );
  const handleReset = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    } else {
      reset();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-neutral-200 animate-pulse rounded-lg" />
    );
  }
  if (!clothingItems) {
    return null;
  }
  return (
    <>
      <ConfirmationDialog />
      <OrderModal
        clothingItems={clothingItems}
        setIsOrderPending={setIsOrderPending}
      />
      <Card className="shadow-none border-none">
        <CardHeader className="sm:p-4 xl:p-6">
          <CardTitle className=" flex items-center justify-between tracking-wide">
            <div className="flex items-center gap-x-2 text-lg md:text-xl">
              <Package className="size-5 md:size-6" />
              <span>New Order</span>
            </div>
            <DayTime />
          </CardTitle>
        </CardHeader>
        <CardContent className="sm:p-4 xl:p-6">
          <div className="w-full mt-2">
            <OrderItemAccordian
              data={topwearClothing}
              title="Top Wear Clothing"
              defaultOpen
            />
            <OrderItemAccordian
              data={bottomwearClothing}
              title="Bottom Wear Clothing"
              defaultOpen
            />
            <OrderItemAccordian data={householdItems} title="Household Items" />
            <OrderItemAccordian
              data={outwearClothing}
              title="Outwear & Accessories"
            />
          </div>

          <div
            className="w-full mt-8 flex flex-col md:flex-row items-center justify-between gap-y-4"
            style={{ WebkitUserSelect: "none", userSelect: "none" }}
          >
            <span className="text-xl font-bold">Order Summary</span>
            <div className="flex items-center gap-x-4">
              <Button
                className="flex items-center hover:bg-[#66BB6A] bg-[#43A047] transition"
                disabled={items.length === 0 || orderPending}
                onClick={open}
              >
                <CheckCircle2 className="size-4 md:size-6" />
                {items.length === 0 ? "No Items" : "Continue"}
              </Button>
              <Button
                variant="destructive"
                className="flex items-center"
                disabled={items.length === 0 || orderPending}
                onClick={handleReset}
              >
                <TrashIcon className="size-4 md:size-6" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
          <DottedSeparator
            dotSize="4"
            gapSize="8"
            className="my-4 bg-neutral-600"
          />
          <div className="flex justify-center flex-col gap-y-4 ">
            {orderPending ? (
              <div className="w-full h-32 flex items-center justify-center flex-col gap-x-4 backdrop-blur-md">
                <Loader2 className="size-6 md:size-8 animate-spin" />
                <span className="text-muted-foreground font-semibold">
                  Placing Order
                </span>
              </div>
            ) : (
              <OrderItemDescription />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
