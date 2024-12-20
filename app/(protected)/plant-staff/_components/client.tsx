"use client";

import { DayTime } from "@/components/day-time";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HiOutlineRefresh } from "react-icons/hi";

export const PlantStaffPageClient = () => {
  return (
    <Card className="shadow-none border-none">
      <CardHeader className="p-0 py-4 md:p-6">
        <CardTitle className="flex flex-col-reverse gap-y-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center md:justify-start justify-center gap-x-2 px-4">
            <HiOutlineRefresh className="size-5 md:size-6" />
            <span className="text-lg md:text-xl">Recently Arrived Orders</span>
          </div>
          <Separator className="md:hidden" />
          <div className="flex items-center justify-center">
            <DayTime />
          </div>
        </CardTitle>
      </CardHeader>
      <Separator className="bg-gray-300 hidden md:block" />
    </Card>
  );
};
