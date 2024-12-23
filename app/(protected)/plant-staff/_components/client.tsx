"use client";

import { useEffect, useState } from "react";

import { PlantStaffDataTable } from "./plant-staff-data-table";
import { columns } from "./columns";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";

import { ClothingItemsDescription } from "./clothing-items-description";

import { useGetHostels } from "@/hooks/hostel/use-get-hostels";

import { useGetAllLaundriesByHostelAndDay } from "@/hooks/organization/use-get-all-laundries-by-hostel-and-day";

export type GroupedData = {
  name: string;
  total_qty: number;
  hostel_id: string;
  arrived_on: string | Date;
  plant_confirmed_time: Date | null;
};

export const PlantStaffPageClient = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hostelId, setHostelId] = useState<string>("None");

  const { data: availableLaundries, isLoading: isLaundriesLoading } =
    useGetAllLaundriesByHostelAndDay(hostelId, selectedDate);

  const { data: hostels, isLoading: isHostelsLoading } = useGetHostels();

  const [columnData, setColumnData] = useState<GroupedData[]>([]);
  useEffect(() => {
    const groupedData: {
      [key: string]: GroupedData;
    } = {};
    if (availableLaundries && hostels) {
      availableLaundries.forEach((laundry) => {
        const hostelName = hostels.find(
          (item) => item.id === laundry.hostelId
        )?.name;
        if (hostelName) {
          const key = `${hostelName}`;
          if (!groupedData[key] && laundry.confirmed_time) {
            groupedData[key] = {
              name: hostelName,
              hostel_id: laundry.hostelId!,
              total_qty: 0,
              arrived_on: laundry.confirmed_time,
              plant_confirmed_time: laundry.plant_confirmed_time,
            };
          }
          groupedData[key].total_qty += laundry.total_quantity;
        }
      });
    }
    setColumnData(Object.values(groupedData));
  }, [availableLaundries, hostels]);

  const handleHostelName = (value: string) => {
    if (value === "None") {
      setHostelId("None");
    } else {
      const id = hostels?.find((item) => item.name === value)?.id;
      if (id) {
        setHostelId(id);
      }
    }
  };
  const handleSelectedDate = (value: Date | string) => {
    setSelectedDate(new Date(value));
  };
  if (isHostelsLoading) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] bg-neutral-500 animate-pulse rounded-lg" />
    );
  }
  if (!hostels) {
    return null;
  }
  return (
    <CustomCardWithHeader title="Recently Arrived Orders">
      <PlantStaffDataTable
        data={columnData}
        columns={columns}
        hostels={hostels}
        handleInput={handleHostelName}
        setSelectedDate={handleSelectedDate}
        isLoading={isLaundriesLoading}
      />
      <ClothingItemsDescription
        data={availableLaundries}
        selectedDate={new Date(selectedDate)}
        isLoading={isLaundriesLoading}
      />
    </CustomCardWithHeader>
  );
};
