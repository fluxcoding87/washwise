"use client";

import { LaundryOrderItemCard } from "@/app/(protected)/_components/laundry-order-item-card";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import CalendarInput from "@/components/ui/date-picker";
import { useGetLaundries } from "@/hooks/clothing/use-get-laundries";
import { useCallback, useMemo, useState } from "react";
import { MdDateRange, MdHistory } from "react-icons/md";
import { Items } from "./items";

export const HistoryPageClient = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: laundries, isLoading } = useGetLaundries(
    "history",
    selectedDate
  );
  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);
  return (
    <CustomCardWithHeader title="History" icon={MdHistory}>
      <div className="w-full space-y-2">
        <div className="w-full flex flex-col justify-center gap-6">
          <div className="font-semibold flex items-center gap-x-2 px-4 py-2">
            <MdDateRange className="size-8" />
            <span className="text-lg sm:text-xl">
              View Order History By Date
            </span>
          </div>
          <CalendarInput
            value={selectedDate}
            onChange={(val) => handleDateChange(val)}
          />
        </div>
        <Items laundries={laundries} isLoading={isLoading} />
      </div>
    </CustomCardWithHeader>
  );
};
