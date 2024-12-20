"use client";

import { itemIconMap } from "@/app/(protected)/student/new-order/_components/order-page-client";
import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";
import { GiShirt } from "react-icons/gi";

export const ItemNameCell = ({
  clothingItemId,
}: {
  clothingItemId: string;
}) => {
  const { data: clothingItems, isLoading } = useGetClothingItems();
  if (!clothingItems) {
    return null;
  }
  const name =
    clothingItems.find((item) => item.id === clothingItemId)?.name ??
    "New Item";
  const Icon = itemIconMap.find((item) => item.name === name)?.icon ?? GiShirt;

  return (
    <div className="flex items-center gap-x-2 md:gap-x-4 py-2">
      <Icon className="size-4 md:size-6 text-sky-700" />
      <div className="font-semibold text-sm md:text-base md:text-[17px] text-neutral-800 ">
        {name}
      </div>
    </div>
  );
};
