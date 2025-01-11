"use client";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Laundry } from "@prisma/client";
import { Divide, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import animationData from "@/public/not-found.json";
import Lottie from "lottie-react";
// const chartData = [
//   { day: "January", desktop: 186, mobile: 80 },
//   { day: "February", desktop: 305, mobile: 200 },
//   { day: "March", desktop: 237, mobile: 120 },
//   { day: "April", desktop: 73, mobile: 190 },
//   { day: "May", desktop: 209, mobile: 130 },
//   { day: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  data: {
    label: "Laundries",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const weekDays = [
  { day: 0, name: "Sun", total: 0 },
  { day: 1, name: "Mon", total: 0 },
  { day: 2, name: "Tue", total: 0 },
  { day: 3, name: "Wed", total: 0 },
  { day: 4, name: "Thu", total: 0 },
  { day: 5, name: "Fri", total: 0 },
  { day: 6, name: "Sat", total: 0 },
];

interface AdminLaundryChartProps {
  data: Laundry[];
  isLoading: boolean;
}

export function AdminLaundryChart({ data, isLoading }: AdminLaundryChartProps) {
  const [chartData, setChartData] = useState<
    { day: number; name: string; total: number }[]
  >([]);

  useEffect(() => {
    if (data.length > 0) {
      // const mapData = data.map((item) => {
      //   return {
      //     day: new Date(item.createdAt).getDay() ?? new Date().getDay(),
      //     totalQty: item.total_quantity,
      //     student_confirmed_time: item.student_confirmed_time,
      //     hostel_confirmed_time: item.confirmed_time,
      //     plant_confirmed_time: item.plant_confirmed_time,
      //   };
      // });
      const chartGroupData: { day: number; total: number }[] = [];
      data.forEach((item) => {
        const itemDay = new Date(item.createdAt).getDay();
        const existingItem = chartGroupData.findIndex(
          (val) => itemDay === val.day
        );
        if (existingItem === -1) {
          chartGroupData.push({ day: itemDay, total: 1 });
        } else {
          chartGroupData[existingItem].total += 1;
        }
      });
      const mergedData = weekDays.map((dayObj) => {
        const matchingData = chartGroupData.find(
          (data) => data.day === dayObj.day
        );
        return matchingData ? { ...dayObj, total: matchingData.total } : dayObj;
      });
      setChartData(mergedData);
    }
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto py-4">
      {isLoading ? (
        <div className="size-full flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={500} className="h-full">
          {data.length === 0 ? (
            <div className="size-full flex items-center relative justify-center">
              <Lottie animationData={animationData} loop />
            </div>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis
                tickCount={15} // Adjusts the number of ticks on the Y-axis
                domain={[0, "dataMax"]} // Sets the range to start from 0 to the maximum value in the data
                interval={0} // Ensures each tick is shown (especially for steps of 1)
                allowDecimals={false} // Ensures no decimals are displayed
              />
              <Tooltip />
              <Bar dataKey="total" fill="#007dfc" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
