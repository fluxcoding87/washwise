"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { format } from "date-fns";
import { ClockIcon } from "lucide-react";

export const ProtectedPageClient = () => {
  const currentDate = new Date();
  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-lg md:text-2xl flex items-center justify-between">
          Recent Orders
          <div className="flex items-center text-sm md:text-lg md:tracking-tight gap-x-1 md:gap-x-2 font-normal text-sky-700">
            <ClockIcon className="size-4 md:size-5" />
            {format(currentDate, "EEEE, do MMM")}
          </div>
        </CardTitle>
        <CardContent></CardContent>
      </CardHeader>
    </Card>
  );
};
