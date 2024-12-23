/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CustomCardWithHeader } from "@/components/custom-card-with-header";

import { useGetAllLaundriesByHostelAndDay } from "@/hooks/organization/use-get-all-laundries-by-hostel-and-day";
import { format } from "date-fns";

import { BiBasket, BiSolidBox } from "react-icons/bi";
import { DateDataTable } from "./hostel-laundry-date-data-table";
import { hostelDateColumns } from "./columns";
import { useEffect, useState } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { LaundryWithClothes } from "@/types/clothing";

import { ClothingItemWithQty } from "./clothing-item-with-qty";
import { TotalQtyBadge } from "./total-qty-badge";

import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";

interface ArrivedOnPageClientProps {
  hostelId: string;
  arrivedOn: string | Date;
}

export type IndividualClothesTotal = {
  clothingItemId: string;
  total_qty: number;
  name: string;
  min_weight: number;
  max_weight?: number | null;
};

export const ArrivedOnPageClient = ({
  hostelId,
  arrivedOn,
}: ArrivedOnPageClientProps) => {
  const { data: actualClothingItems, isLoading: clothingItemsLoading } =
    useGetClothingItems();
  const { data: laundries, isLoading } = useGetAllLaundriesByHostelAndDay(
    hostelId,
    arrivedOn
  );
  const [searchedLaundries, setSearchedLaundries] = useState<
    LaundryWithClothes[] | undefined | null
  >(laundries);
  const [roomNumber, setRoomNumber] = useState<string | null>(null);
  const [individualClothesTotal, setIndividualClothesTotal] = useState<
    IndividualClothesTotal[]
  >([]);
  const [minimumWeight, setMinimumWeight] = useState(0);
  const [maximumWeight, setMaximumWeight] = useState(0);
  useEffect(() => {
    if (laundries) {
      setSearchedLaundries(laundries);
    }
  }, [laundries]);
  useEffect(() => {
    if (searchedLaundries && !isLoading) {
      setIndividualClothesTotal((prev) => {
        const latestValues: IndividualClothesTotal[] = [];
        searchedLaundries.forEach((laundry) => {
          laundry.clothes.clothingItems.forEach((item) => {
            const existingItemIndex = latestValues.findIndex(
              (value) => value.clothingItemId === item.clothingItemId
            );
            if (existingItemIndex === -1) {
              const clothingItem = actualClothingItems?.find(
                (val) => val.id === item.clothingItemId
              );
              if (clothingItem)
                latestValues.push({
                  name: clothingItem.name,
                  clothingItemId: item.clothingItemId,
                  total_qty: item.quantity,
                  min_weight: clothingItem.min_weight_in_grams,
                  max_weight: clothingItem.max_weight_in_grams!,
                });
            } else {
              latestValues[existingItemIndex].total_qty += item.quantity;
            }
          });
        });
        const updatedValues = latestValues.map((item) => {
          const minimum = item.min_weight * item.total_qty;
          const maximum = item.max_weight! * item.total_qty;

          return {
            ...item,
            min_weight: minimum,
            max_weight: maximum,
          };
        });
        return updatedValues;
      });
    }
  }, [searchedLaundries, isLoading]);

  useEffect(() => {
    if (individualClothesTotal.length > 0) {
      const min = individualClothesTotal.reduce(
        (acc, curr) => acc + (curr.min_weight || 0),
        0
      );
      const max = individualClothesTotal.reduce(
        (acc, curr) => acc + (curr.max_weight || 0),
        0
      );
      setMinimumWeight(min / 1000);
      setMaximumWeight(max / 1000);
    }
  }, [individualClothesTotal]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!roomNumber) {
        setSearchedLaundries(laundries);
      } else {
        const updatedValues = laundries?.filter(
          (item) => item.room_no === roomNumber
        );
        setSearchedLaundries(updatedValues);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [laundries, roomNumber]);
  const setRoomLaundries = (value: string) => {
    setRoomNumber(value);
  };
  if (isLoading) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] bg-neutral-200 animate-pulse" />
    );
  }
  if (!laundries) {
    return null;
  }

  return (
    <CustomCardWithHeader
      icon={BiBasket}
      title={`Laundries on ${format(arrivedOn, "dd MMM, EEEE")}`}
    >
      <DateDataTable
        columns={hostelDateColumns}
        data={laundries}
        setRoomLaundries={setRoomLaundries}
      />
      <div className="px-2 py-4">
        <div className="flex flex-col-reverse md:flex-row md:items-end md:justify-between mb-8 border-b border-b-neutral-300 pb-4">
          <div className="flex items-center gap-x-2 mt-4 md:mt-0">
            <BiSolidBox className="size-6" />
            <span className="text-xl font-medium">Total Items in order</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <TotalQtyBadge
              type="weight"
              weight={minimumWeight}
              title="MINIMUM"
            />
            <TotalQtyBadge
              type="weight"
              weight={maximumWeight}
              title="MAXIMUM"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {individualClothesTotal.map((item) => (
            <ClothingItemWithQty key={item.clothingItemId} item={item} />
          ))}
        </div>
      </div>
      <DottedSeparator
        dotSize="4"
        gapSize="8"
        className="my-4 bg-neutral-600"
      />
      <div></div>
    </CustomCardWithHeader>
  );
};
