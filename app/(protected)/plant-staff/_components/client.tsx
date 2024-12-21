"use client";

import { DayTime } from "@/components/day-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetAllOrgLaundries } from "@/hooks/organization/use-get-all-org-laundries";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { PlantStaffDataTable } from "./plant-staff-data-table";
import { columns } from "./columns";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { format } from "date-fns";

export type GroupedData = {
  name: string;
  total_qty: number;
  hostel_id: string;
  arrived_on: string;
  plant_confirmed_time: Date | null;
};

export const PlantStaffPageClient = () => {
  const { data: staffData, isLoading } = useGetAllOrgLaundries();
  const [columnData, setColumnData] = useState<GroupedData[]>([]);
  useEffect(() => {
    if (!isLoading && staffData) {
      const groupedData: {
        [key: string]: GroupedData;
      } = {};
      if (staffData)
        staffData.hostels.forEach((hostel) => {
          hostel.laundries.forEach((laundry) => {
            if (laundry.confirmed_time) {
              const confirmedReal = new Date(laundry.confirmed_time);
              const confirmedDay = confirmedReal.getDay();
              const key = `${hostel.name}-${confirmedDay}`;

              if (!groupedData[key]) {
                groupedData[key] = {
                  name: hostel.name,
                  hostel_id: hostel.id,
                  total_qty: 0,
                  arrived_on: format(confirmedReal, "yyyy-MM-dd"),
                  plant_confirmed_time: laundry.plant_confirmed_time,
                };
              }
              groupedData[key].total_qty += laundry.total_quantity;
            }
          });
        });
      setColumnData(Object.values(groupedData));
    }
  }, [staffData, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] bg-neutral-200 animate-pulse rounded-lg" />
    );
  }
  if (!staffData) {
    return null;
  }
  return (
    <CustomCardWithHeader title="Recently Arrived Orders">
      <PlantStaffDataTable data={columnData} columns={columns} />
    </CustomCardWithHeader>
  );
};
