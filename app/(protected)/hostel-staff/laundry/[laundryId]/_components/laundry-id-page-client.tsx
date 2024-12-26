"use client";

import { DayTime } from "@/components/day-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetLaundryById } from "@/hooks/clothing/use-get-laundry-by-id";
import { BiBasket } from "react-icons/bi";
import { OrderDataTable } from "./order-data-table";
import { columns } from "./columns";
import { format } from "date-fns";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { MdRoom } from "react-icons/md";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";

interface LaundryIdPageClientProps {
  id: string;
}

export const LaundryIdPageClient = ({ id }: LaundryIdPageClientProps) => {
  const { data, isLoading } = useGetLaundryById(id);
  if (isLoading) {
    return (
      <div className="w-full rounded-lg h-[400px] md:h-[600px] bg-neutral-300 animate-pulse" />
    );
  }
  if (!data) {
    return null;
  }
  return (
    <CustomCardWithHeader icon={BiBasket} title="Laundry Order">
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 text-base gap-y-4">
        <div className="flex items-center gap-x-1 ring-1 ring-primary px-2 py-4 rounded-xl">
          <div className="flex items-center gap-x-2 font-semibold">
            <HiOutlineClipboardCheck className="size-6 text-primary" />
            <span>Placed On</span>
          </div>
          <span className="font-semibold">
            {format(data.createdAt, "dd MMM, EEEE h:mm a")}
          </span>
        </div>
        <div className="flex items-center gap-x-1 ring-1 ring-primary px-2 py-4 rounded-xl">
          <div className="flex items-center gap-x-1 font-semibold">
            <MdRoom className="size-6 text-primary" />
            <span>Room</span>
          </div>
          <span className="font-semibold">{data.room_no}</span>
        </div>
      </div>
      <div className="">
        <OrderDataTable
          id={id}
          columns={columns}
          data={data?.clothes.clothingItems}
          clothesClothingItems={data.clothes.clothingItems}
          totalQty={data.total_quantity}
          confirmedAt={data.confirmed_time}
          plant_confirmed_time={data.plant_confirmed_time}
        />
      </div>
    </CustomCardWithHeader>
  );
};
