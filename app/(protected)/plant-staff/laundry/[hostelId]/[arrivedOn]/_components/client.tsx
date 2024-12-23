/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CheckCircle2, Loader2 } from "lucide-react";
import { ClothingItemsDescription } from "@/app/(protected)/plant-staff/_components/clothing-items-description";
import { useGetHostels } from "@/hooks/hostel/use-get-hostels";
import { useConfirm } from "@/hooks/use-confirm";
import { useConfirmPlantTime } from "@/hooks/plant-staff/use-confirm-plant-staff-time";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

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
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setIsConfirmed] = useState(false);
  const { data: laundries, isLoading: isLaundriesLoading } =
    useGetAllLaundriesByHostelAndDay(hostelId, arrivedOn);
  const { data: hostels, isLoading: isHostelsLoading } = useGetHostels();
  const [hostelName, setHostelName] = useState<string>();
  const { mutate, isPending } = useConfirmPlantTime();
  const [ConfirmationDialog, confirm] = useConfirm(
    `You want to confirm ALL ORDERS of ${hostelName} arrived on ${format(
      arrivedOn,
      "dd, MMM yyyy"
    )}. This action is irreversible!`,
    ""
  );
  const queryClient = useQueryClient();
  const [searchedLaundries, setSearchedLaundries] = useState<
    LaundryWithClothes[] | undefined | null
  >(laundries);
  const [roomNumber, setRoomNumber] = useState<string | null>(null);
  useEffect(() => {
    if (laundries && hostels) {
      const hostelName = hostels.find(
        (item) => item.id === laundries[0].hostelId
      )?.name;
      if (hostelName) {
        setHostelName(hostelName);
      }
      const hasConfirmedTime = laundries.reduce((acc, laundry) => {
        return acc || laundry.plant_confirmed_time !== null;
      }, false);
      setIsConfirmed(hasConfirmedTime);

      setSearchedLaundries(laundries);
    }
  }, [laundries, hostels]);

  // useEffect(() => {
  //   if (laundries && !isLaundriesLoading) {
  //     const groupedData: {
  //       [key: string]: GroupedDataByRoom;
  //     } = {};
  //     setIsLoading(true);
  //     laundries.forEach((laundry) => {
  //       if (laundry.room_no) {
  //         const key = `${laundry.room_no}`;
  //         if (!groupedData[key]) {
  //           groupedData[key] = {
  //             room_no: laundry.room_no,
  //             total_qty: 0,
  //             laundry_id: laundry.id,
  //             hostel_confirmed_on: laundry.confirmed_time,
  //             plant_confirmed_time: laundry.plant_confirmed_time,
  //           };
  //         }
  //         groupedData[key].total_qty += laundry.total_quantity;
  //       }
  //     });
  //     setColumnData(Object.values(groupedData));
  //     setIsLoading(false);
  //   }
  // }, [laundries, isLaundriesLoading]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      if (!roomNumber) {
        setSearchedLaundries(laundries);
      } else {
        const updatedValues = laundries?.filter(
          (item) => item.room_no === roomNumber
        );
        setSearchedLaundries(updatedValues);
      }
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [laundries, roomNumber]);
  const setRoomLaundries = (value: string) => {
    setRoomNumber(value);
  };
  const handleConfirmOrder = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    } else {
      mutate(
        { hostelId, arrivedOn },
        {
          onSuccess: () => {
            setIsConfirmed(true);
            queryClient.invalidateQueries({
              queryKey: [`laundries_${hostelId}_${arrivedOn}`],
            });
          },
        }
      );
    }
  };

  if (isLaundriesLoading) {
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
      title={`Laundries of ${hostelName} on ${format(arrivedOn, "dd MMM")}`}
    >
      <ConfirmationDialog />
      <DateDataTable
        columns={hostelDateColumns}
        data={laundries}
        setRoomLaundries={setRoomLaundries}
      />
      <ClothingItemsDescription
        data={searchedLaundries}
        selectedDate={new Date(arrivedOn)}
        isLoading={isLoading || isPending}
      />
      <DottedSeparator
        dotSize="4"
        gapSize="8"
        className="my-4 bg-neutral-600"
      />
      <div className="w-full">
        <button
          disabled={isPending || isLoading || confirmed}
          onClick={handleConfirmOrder}
          className={cn(
            "w-full p-4 bg-sky-700 cursor-pointer font-bold text-lg rounded-lg text-white flex items-center justify-center gap-x-4 hover:bg-sky-600 hover:opacity-75 transition",
            confirmed && "bg-green-600 hover:bg-green-700 hover:opacity-95"
          )}
        >
          <CheckCircle2 />
          <span>
            {confirmed ? "Laundries Confirmed" : "Confirm All Orders"}
          </span>
        </button>
      </div>
    </CustomCardWithHeader>
  );
};
