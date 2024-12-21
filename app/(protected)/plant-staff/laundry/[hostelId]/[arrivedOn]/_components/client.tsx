/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { Card } from "@/components/ui/card";
import { useGetAllLaundriesByHostelAndDay } from "@/hooks/organization/use-get-all-laundries-by-hostel-and-day";
import { format } from "date-fns";
import { NextResponse } from "next/server";
import { BiBasket, BiSolidBox } from "react-icons/bi";
import { DateDataTable } from "./hostel-laundry-date-data-table";
import { hostelDateColumns } from "./columns";
import { useEffect, useState } from "react";
import { itemIconMap } from "@/app/(protected)/student/new-order/_components/order-page-client";
import { GiShirt } from "react-icons/gi";
import { DottedSeparator } from "@/components/dotted-separator";
import { LaundryWithClothes } from "@/types/clothing";
import { Separator } from "@/components/ui/separator";

interface ArrivedOnPageClientProps {
  hostelId: string;
  arrivedOn: string;
}

type IndividualClothesTotal = {
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
              latestValues.push({
                name: item.clothingItem.name,
                clothingItemId: item.clothingItemId,
                total_qty: item.quantity,
                min_weight: item.clothingItem.min_weight_in_grams,
                max_weight: item.clothingItem.max_weight_in_grams!,
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
      console.log("Individual Clothes Total:", individualClothesTotal); // Debug log for individual clothes total

      const min = individualClothesTotal.reduce(
        (acc, curr) => acc + (curr.min_weight || 0), // Default to 0 if undefined
        0
      );
      const max = individualClothesTotal.reduce(
        (acc, curr) => acc + (curr.max_weight || 0), // Default to 0 if undefined
        0
      );

      // Update state for minimum and maximum weight
      setMinimumWeight(min / 1000); // Convert to kilograms
      setMaximumWeight(max / 1000); // Convert to kilograms
    }
  }, [individualClothesTotal]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!roomNumber) {
        // If no room number is selected, show all laundries
        setSearchedLaundries(laundries);
      } else {
        // If room number is selected, filter the laundries
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
            <div className="flex items-center ring-1 ring-primary rounded-lg p-2 gap-x-4 justify-between md:justify-start hover:-translate-y-2 transition duration-200 shadow-lg cursor-pointer ">
              <div className="font-semibold text-sm">MINIMUM</div>
              <div className="font-bold">{minimumWeight} KG</div>
            </div>
            <div className="flex items-center ring-1 ring-primary rounded-lg p-2 gap-x-4 justify-between md:justify-start hover:-translate-y-2 transition duration-200 shadow-lg cursor-pointer ">
              <div className="text-sm font-semibold">MAXIMUM</div>
              <div className="text-center font-bold">{maximumWeight} KG</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {individualClothesTotal.map((item) => {
            const Icon =
              itemIconMap.find((val) => item.name === val.name)?.icon ??
              GiShirt;

            return (
              <div
                key={item.clothingItemId}
                className="flex items-center justify-between rounded-lg group hover:-translate-y-2 transition duration-200 shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-x-2 md:gap-x-4 p-4 flex-1 border border-primary border-r-0 rounded-l-lg">
                  <Icon className="size-5 md:size-6 text-sky-700" />
                  <div className="font-semibold text-base text-neutral-800 ">
                    {item.name}
                  </div>
                </div>
                <div className="flex font-bold text-lg items-center justify-center bg-primary text-white h-[100%] w-[25%] rounded-r-lg border border-primary">
                  {item.total_qty}
                </div>
              </div>
            );
          })}
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
