"use client";

import { DataTable } from "@/components/data-table";
import { DayTime } from "@/components/day-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetLaundriesByHostelId } from "@/hooks/clothing/use-get-laundries-by-hostel-id";
import { HiOutlineRefresh } from "react-icons/hi";
import { HostelStaffColumns } from "./hostel-staff-columns";

import { useEffect } from "react";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";

export const HostelStaffClient = ({ hostelId }: { hostelId: string }) => {
  const { data: laundries, isLoading } = useGetLaundriesByHostelId(hostelId);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] md:h-[500px] xl:h-[600px] bg-neutral-200 animate-pulse rounded-md" />
    );
  }
  if (!laundries) {
    return null;
  }
  return (
    <CustomCardWithHeader icon={HiOutlineRefresh} title="Recent Placed Orders">
      <DataTable columns={HostelStaffColumns} data={laundries} />
    </CustomCardWithHeader>
  );
};
