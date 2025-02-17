import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";

import { useEffect, useState } from "react";
import { IndividualClothesTotal } from "../laundry/[hostelId]/[arrivedOn]/_components/client";
import { BiSolidBox } from "react-icons/bi";
import { TotalQtyBadge } from "../laundry/[hostelId]/[arrivedOn]/_components/total-qty-badge";
import { ClothingItemWithQty } from "../laundry/[hostelId]/[arrivedOn]/_components/clothing-item-with-qty";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { LaundryWithClothes } from "@/types/clothing";

interface ClothingItemsDescriptionProps {
  isLoading: boolean;
  data: LaundryWithClothes[] | undefined | null;
  selectedDate: Date;
}

export const ClothingItemsDescription = ({
  data,
  selectedDate,
  isLoading,
}: ClothingItemsDescriptionProps) => {
  const [clothingItemsData, setClothingItemsData] = useState<
    IndividualClothesTotal[] | undefined
  >([]);
  const { data: clothingItems, isLoading: isClothingItemsLoading } =
    useGetClothingItems();
  const [minimumWeight, setMinimumWeight] = useState(0);
  const [maximumWeight, setMaximumWeight] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const today = new Date();
  useEffect(() => {
    if (data && clothingItems && !isLoading && data.length > 0) {
      const itemsData: IndividualClothesTotal[] = [];
      data.forEach((laundry) => {
        if (!laundry) {
          return;
        }
        const laundryDay = new Date(laundry.confirmed_time!);
        if (selectedDate.getDay() !== laundryDay.getDay()) {
          // skip this iteration if it is not today
          return;
        }
        laundry.clothes.clothingItems.forEach((item) => {
          const clothingItem = clothingItems.find(
            (cloth) => cloth.id === item.clothingItemId
          );
          if (clothingItem) {
            const existingItemIndex = itemsData.findIndex(
              (val) => val.clothingItemId === item.clothingItemId
            );
            if (existingItemIndex === -1) {
              itemsData.push({
                clothingItemId: item.clothingItemId,
                total_qty: item.quantity,
                name: clothingItem.name,
                min_weight: clothingItem.min_weight_in_grams,
                max_weight: clothingItem.max_weight_in_grams,
              });
            } else {
              itemsData[existingItemIndex].total_qty += item.quantity;
            }
          }
        });
      });

      const updatedValues = itemsData.map((item) => {
        const minimum = item.min_weight * item.total_qty;
        const maximum = item.max_weight! * item.total_qty;

        return {
          ...item,
          min_weight: minimum,
          max_weight: maximum,
        };
      });

      setClothingItemsData(updatedValues);
    } else {
      setClothingItemsData(undefined);
    }
  }, [data, clothingItems, isLoading, selectedDate]);
  useEffect(() => {
    if (clothingItemsData) {
      if (clothingItemsData.length > 0) {
        const min = clothingItemsData.reduce(
          (acc, curr) => acc + (curr.min_weight || 0),
          0
        );
        const max = clothingItemsData.reduce(
          (acc, curr) => acc + (curr.max_weight || 0),
          0
        );
        const total = clothingItemsData.reduce(
          (acc, curr) => (acc += curr.total_qty),
          0
        );

        setTotalItems(total);
        setMinimumWeight(min / 1000);
        setMaximumWeight(max / 1000);
      }
    } else {
      setTotalItems(0);
      setMinimumWeight(0);
      setMaximumWeight(0);
    }
  }, [clothingItemsData]);

  if (isClothingItemsLoading) {
    return <div className="w-full h-36 animate-pulse bg-neutral-200" />;
  }

  return (
    <div className="px-2 py-4">
      <div className="flex flex-col-reverse xl:flex-row xl:items-end xl:justify-between mb-8 border-b border-b-neutral-300 pb-4">
        <div className="flex flex-col md:flex-row items-center gap-x-2 mt-8 xl:mt-0">
          <div className="flex items-center gap-x-2">
            <BiSolidBox className="size-6" />
            <span className="text-xl font-bold">
              Total Items{" "}
              {selectedDate.getDay() === today.getDay() ? "Today" : "On"}
            </span>
          </div>

          <span
            className={cn(
              "text-xl font-bold",
              selectedDate.getDay() === today.getDay() && "text-base"
            )}
          >
            {selectedDate.getDay() === today.getDay()
              ? `(${format(selectedDate, "EEEE, MMM dd")})`
              : format(selectedDate, "EEEE, MMM dd")}
          </span>
        </div>
        <div className="flex flex-col sm:items-center xl:flex-row xl:items-center gap-4">
          {isLoading ? (
            <>
              <div className="w-[120px] h-[40px] bg-neutral-500 animate-pulse rounded-lg" />
              <div className="w-[120px] h-[40px] bg-neutral-500 animate-pulse rounded-lg" />
              <div className="w-[120px] h-[40px] bg-neutral-500 animate-pulse rounded-lg" />
            </>
          ) : (
            <>
              <TotalQtyBadge
                type="item"
                weight={totalItems}
                title="TOTAL ITEMS"
              />
              <TotalQtyBadge
                type="weight"
                weight={minimumWeight}
                title="Minimum Weight"
              />
              <TotalQtyBadge
                type="weight"
                weight={maximumWeight}
                title="Maximum Weight"
              />
            </>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="h-32 flex items-center justify-center animate-pulse bg-neutral-500 rounded-md"></div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4",
            !clothingItemsData &&
              "flex items-center justify-center size-full text-sm"
          )}
        >
          {clothingItemsData
            ? clothingItemsData?.map((item) => (
                <ClothingItemWithQty key={item.clothingItemId} item={item} />
              ))
            : "No Items."}
        </div>
      )}
    </div>
  );
};
