import { Separator } from "@/components/ui/separator";
import { Laundry } from "@prisma/client";
import { format } from "date-fns";
import { CalendarFold } from "lucide-react";
import { GiClothes } from "react-icons/gi";
import { MdOutlinePendingActions } from "react-icons/md";
interface LaundryOrderItemCardProps {
  data: Laundry;
}

export const LaundryOrderItemCard = ({ data }: LaundryOrderItemCardProps) => {
  const currentDay = format(new Date(), "EEEE");
  const laundryDay = format(data.createdAt, "EEEE");
  const laundryTime = format(data.createdAt, "h:mm a");

  return (
    <div className="rounded-xl border border-primary justify-center shadow-md hover:-translate-y-2 transition cursor-pointer">
      <div className="p-4 rounded-xl">
        <div className="flex items-center gap-x-2">
          <CalendarFold className="text-primary size-6" />
          <span className="font-bold text-base tracking-wide">
            {laundryDay === currentDay ? "Today" : laundryDay}, {laundryTime}
          </span>
        </div>
      </div>
      <Separator className="mb-2" />
      <div className="p-4 flex items-center gap-x-4">
        <GiClothes className="size-4 md:size-6 text-sky-700" />
        <span className="font-semibold text-base">
          {data.total_quantity} Clothes
        </span>
      </div>
      <div className="rounded-b-xl bg-[#FFE0B2] flex items-center justify-center p-3 gap-x-2">
        <MdOutlinePendingActions className="size-5" />
        <span className="text-sm font-semibold">Pending Confirmation</span>
      </div>
    </div>
  );
};
