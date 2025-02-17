"use client";
import { DateRangePicker } from "@/components/date-range-picker";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetHostels } from "@/hooks/hostel/use-get-hostels";
import { useState } from "react";
import { Range } from "react-date-range";
import { AdminLaundryOverview } from "./admin-laundry-overview";

export const AdminHomePageClient = () => {
  const { data: hostels, isLoading } = useGetHostels();
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [selectedHostelId, setSelectedHostelId] = useState<string>("all");

  return (
    <Card>
      <CardHeader>
        <div className="text-xl font-semibold">
          <span>Home</span>
        </div>
        <p className="text-muted-foreground font-medium">
          Overview of all the laundries.
        </p>
      </CardHeader>
      {isLoading ? (
        <div className="w-full h-[400px] animate-pulse bg-neutral-300 rounded-b-xl" />
      ) : (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              {hostels && hostels.length > 0 && (
                <Select
                  onValueChange={(val) => {
                    setSelectedHostelId(val);
                  }}
                  defaultValue={selectedHostelId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hostels</SelectItem>
                    {hostels.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <DateRangePicker
                value={dateRange}
                onChange={(value) => {
                  setDateRange(value.selection);
                }}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />
            </div>
          </div>
          <div>
            <AdminLaundryOverview
              selectedHostelId={selectedHostelId}
              startDate={dateRange.startDate ?? new Date()}
              endDate={dateRange.endDate ?? new Date()}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};
