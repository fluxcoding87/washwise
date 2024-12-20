"use client";

import { DataTable } from "@/components/data-table";
import { DayTime } from "@/components/day-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetLaundriesByHostelId } from "@/hooks/clothing/use-get-laundries-by-hostel-id";
import { HiOutlineRefresh } from "react-icons/hi";
import { HostelStaffColumns } from "./hostel-staff-columns";

import { useEffect } from "react";

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
    <Card className="shadow-none border-none">
      <CardHeader className="p-0 py-4 md:p-6">
        <CardTitle className="flex flex-col-reverse gap-y-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-x-2 px-4">
            <HiOutlineRefresh className="size-5 md:size-6" />
            <span className="text-lg md:text-xl">Recent Placed Orders</span>
          </div>
          <Separator className="md:hidden" />
          <div className="flex items-center justify-center">
            <DayTime />
          </div>
        </CardTitle>
      </CardHeader>
      <Separator className="bg-gray-300 hidden md:block" />
      <CardContent className="p-0">
        <div className="mt-6 px-2 md:p-6">
          <DataTable columns={HostelStaffColumns} data={laundries} />
        </div>
      </CardContent>
    </Card>
  );
};
