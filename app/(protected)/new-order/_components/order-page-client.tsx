"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";

import { format } from "date-fns";
import { ClockIcon, TrashIcon } from "lucide-react";
import { FaCloud, FaCut, FaGraduationCap, FaTshirt } from "react-icons/fa";
import { AiOutlineLayout } from "react-icons/ai";
import {
  GiFeather,
  GiFoldedPaper,
  GiNecklaceDisplay,
  GiRolledCloth,
  GiShorts,
  GiTShirt,
  GiWinterGloves,
  GiWinterHat,
} from "react-icons/gi";
import { BiSquare } from "react-icons/bi";
import { WiCloudy } from "react-icons/wi";
import { useForm } from "react-hook-form";
import { OrderItem } from "./order-item";
import { OrderItemAccordian } from "./order-item-accordian";
import { useCallback, useMemo } from "react";
import { ClothingItem } from "@prisma/client";
import { OrderItemDescription } from "./order-item-description";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { useClothingItemsStore } from "@/hooks/clothing/clothingItems/use-clothing-items-store";

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
  const currentDate = new Date();
  const { data: clothingItems, isLoading } = useGetClothingItems();
  const { reset } = useClothingItemsStore();
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
  if (isLoading) {
    return (
      <div className="w-full h-96 bg-neutral-200 animate-pulse rounded-lg" />
    );
  }
  if (!clothingItems) {
    return null;
  }

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="sm:p-4 xl:p-6">
        <CardTitle className="text-lg md:text-2xl flex items-center justify-between">
          New Order
          <div className="flex items-center text-sm md:text-lg md:tracking-tight gap-x-1 md:gap-x-2 font-normal text-sky-700">
            <ClockIcon className="size-4 md:size-5" />
            {format(currentDate, "EEEE, do MMM")}
          </div>
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
          className="w-full mt-8 flex items-center justify-between"
          style={{ WebkitUserSelect: "none", userSelect: "none" }}
        >
          <span className="text-xl font-bold">Order Summary</span>
          <Button
            variant="destructive"
            className="flex items-center"
            onClick={reset}
          >
            <TrashIcon className="size-4 md:size-6" />
            <span>Reset</span>
          </Button>
        </div>
        <DottedSeparator
          dotSize="4"
          gapSize="8"
          className="my-4 bg-neutral-600"
        />
        <div>
          <OrderItemDescription />
        </div>
      </CardContent>
    </Card>
  );
};
