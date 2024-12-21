"use client";
import { DayTime } from "@/components/day-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetLaundries } from "@/hooks/clothing/use-get-laundries";
import Image from "next/image";
import { HiOutlineRefresh } from "react-icons/hi";
import { LaundryOrderItemCard } from "./laundry-order-item-card";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";

export const StudentClient = () => {
  const { data: laundries, isLoading } = useGetLaundries();
  if (isLoading) {
    return (
      <div className="w-full rounded-lg h-[400px] md:h-[600px] bg-neutral-300 animate-pulse" />
    );
  }
  return (
    <CustomCardWithHeader icon={HiOutlineRefresh} title="Your Recent Orders">
      {!laundries || laundries.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center mt-8">
          <h3 className="mb-4 text-lg sm:text-xl md:text-2xl font-semibold text-primary">
            Uh Oh! Looks like you haven&apos;t placed an order yet.
          </h3>
          <div className="relative size-[320px] sm:size-[380px] md:size-[480px]">
            <Image fill src="/laundry-illustration.jpg" alt="ill" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-4 font-medium">
            Go to New Order and place one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 md:px-4 py-6">
          {laundries.map((item) => (
            <LaundryOrderItemCard key={item.id} data={item} />
          ))}
        </div>
      )}
    </CustomCardWithHeader>
  );
};
