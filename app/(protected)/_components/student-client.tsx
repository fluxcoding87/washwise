"use client";
import { useGetLaundries } from "@/hooks/clothing/use-get-laundries";
import Image from "next/image";
import { HiOutlineRefresh } from "react-icons/hi";
import { LaundryOrderItemCard } from "./laundry-order-item-card";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { useEffect, useState } from "react";
import { OrderItemModal } from "./order-item-modal";
import { useViewItemDetails } from "@/hooks/placed-orders/use-view-item-details";

export const StudentClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { data: laundries, isLoading } = useGetLaundries("home");
  if (isLoading) {
    return (
      <div className="w-full rounded-lg h-[400px] md:h-[600px] bg-neutral-300 animate-pulse" />
    );
  }
  if (!isClient) {
    return null;
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
            <div key={item.id}>
              <LaundryOrderItemCard data={item} />
            </div>
          ))}
        </div>
      )}
    </CustomCardWithHeader>
  );
};
