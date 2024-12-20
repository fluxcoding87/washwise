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
    <Card className="shadow-none border-none">
      <CardHeader className="p-0 py-4 md:p-6">
        <CardTitle className="flex flex-col-reverse gap-y-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-center md:justify-start gap-x-2 px-4">
            <BiBasket className="size-5 md:size-6" />
            <span className="text-lg md:text-xl">Laundry Order</span>
          </div>
          <Separator className="md:hidden" />
          <div className="flex items-center justify-center">
            <DayTime />
          </div>
        </CardTitle>
      </CardHeader>
      <Separator className="bg-gray-300 hidden md:block" />
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 text-base gap-y-4">
          <div className="flex items-center gap-x-1 ring-1 ring-primary px-2 py-4 rounded-xl">
            <div className="flex items-center gap-x-2 font-semibold">
              <HiOutlineClipboardCheck className="size-6 text-primary" />
              <span>Placed On</span>
            </div>
            <span className="font-semibold">
              {format(data.createdAt, "EEEE, h:mm a")}
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
          />
        </div>
      </CardContent>
    </Card>
  );
};
