"use client";

import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";

import { CheckCircle2, Package, Loader2, TrashIcon } from "lucide-react";
import { FaGraduationCap, FaTshirt } from "react-icons/fa";
import { OrderItemAccordian } from "./order-item-accordian";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ClothingItem } from "@prisma/client";
import { OrderItemDescription } from "./order-item-description";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { useClothingItemsStore } from "@/hooks/clothing/clothingItems/use-clothing-items-store";
import { useConfirm } from "@/hooks/use-confirm";
import { OrderModal } from "@/components/order/order-modal";
import { useOrderModal } from "@/hooks/clothing/use-order-modal";

import { useGetLaundries } from "@/hooks/clothing/use-get-laundries";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";

import { NotFoundPage } from "./not-found-page";
import { FaBed } from "react-icons/fa";
import { AiOutlineFile } from "react-icons/ai";
import {
  GiArmoredPants,
  GiClothes,
  GiHanger,
  GiRolledCloth,
  GiShorts,
  GiWinterHat,
} from "react-icons/gi";
import { MdOutlineKingBed } from "react-icons/md";
import { RiShirtLine } from "react-icons/ri";
import { BsHandbag } from "react-icons/bs";
import { IoMdRose } from "react-icons/io";
import { useGlobalTime } from "@/hooks/use-global-time";
import { useSession } from "next-auth/react";
import { getDay, isAfter, set } from "date-fns";
import { NotAllowedPage } from "@/components/not-allowed-page";

export const itemIconMap = [
  { name: "Blanket", icon: FaBed }, // Bed icon for blankets
  { name: "Bed Sheet", icon: GiClothes }, // Clothes icon for large sheets
  { name: "Towel", icon: BsHandbag }, // Using handbag as a towel substitute
  { name: "Pillow Cover", icon: MdOutlineKingBed }, // KingBed icon for pillow covers
  { name: "Jean", icon: GiArmoredPants }, // Armored pants for jeans
  { name: "School Shirt", icon: RiShirtLine }, // Shirt for school shirt
  { name: "Civil Shirt", icon: FaTshirt }, // T-shirt for casual shirt
  { name: "Lower", icon: GiArmoredPants }, // Armored pants icon
  { name: "T-Shirt", icon: FaTshirt }, // Classic t-shirt icon
  { name: "Nikkar Short", icon: GiShorts }, // Shorts icon for Nikkar
  { name: "School Pant", icon: GiArmoredPants }, // Armored pants for school pants
  { name: "Civil Pant", icon: GiRolledCloth }, // Rolled cloth for casual pants
  { name: "Sweater", icon: GiWinterHat }, // Winter hat for sweater
  { name: "Jacket", icon: GiWinterHat }, // Winter hat for jacket
  { name: "School Sweater", icon: FaGraduationCap }, // Graduation cap for school sweater
  { name: "Coat", icon: GiHanger }, // Hanger icon as an alternative for coat
  { name: "Scarve", icon: IoMdRose }, // Rose icon as a substitute for scarf
  { name: "Salwaar", icon: GiRolledCloth }, // Rolled cloth for traditional wear
  { name: "Kurta", icon: AiOutlineFile }, // Simple file icon for kurta
];

export const OrderPageClient = () => {
  const [isAllowed, setIsAllowed] = useState(false);
  const { currentTime } = useGlobalTime();
  const session = useSession();

  const { data: notConfirmedLaundries, isLoading: isLaundriesLoading } =
    useGetLaundries("newOrder");
  const [orderPending, setOrderPending] = useState<boolean>();
  const setIsOrderPending = useCallback((val: boolean) => {
    setOrderPending(val);
  }, []);

  const { open } = useOrderModal();
  const { data: clothingItems, isLoading: isClothingItemsLoading } =
    useGetClothingItems();
  const { reset, items } = useClothingItemsStore();
  const isLoading = isLaundriesLoading || isClothingItemsLoading;
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action will reset the items you just added and cannot be undone."
  );

  useEffect(() => {
    const day = getDay(new Date());
    const reqDate = set(currentTime, {
      hours: 17,
      minutes: 30,
      seconds: 0,
      milliseconds: 0,
    });
    if (session.status !== "loading") {
      const room_no = session.data?.user.room_no;
      if (room_no) {
        if (+room_no <= 200 && day >= 1 && day <= 4) {
          setIsAllowed(true);
        } else if (+room_no > 200 && +room_no <= 400 && day >= 2 && day <= 5) {
          setIsAllowed(true);
        } else if (+room_no > 400 && +room_no <= 600 && day >= 3 && day <= 6) {
          setIsAllowed(true);
        }
      }
    }
    if (isAfter(currentTime, reqDate)) {
      setIsAllowed(false);
    }
  }, [session, currentTime]);

  const filterClothingByType = useCallback(
    (type: string): ClothingItem[] => {
      if (!clothingItems) return [];
      return clothingItems.filter((item) => item.type === type);
    },
    [clothingItems]
  );
  const topwearClothing = useMemo(
    () => filterClothingByType("topwear"),
    [filterClothingByType]
  );
  const bottomwearClothing = useMemo(
    () => filterClothingByType("bottomwear"),
    [filterClothingByType]
  );
  const outwearClothing = useMemo(
    () => filterClothingByType("outwear"),
    [filterClothingByType]
  );
  const householdItems = useMemo(
    () => filterClothingByType("household"),
    [filterClothingByType]
  );
  const handleReset = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    } else {
      reset();
    }
  };
  if (isLoading) {
    return (
      <div className="w-full h-96 bg-neutral-200 animate-pulse rounded-lg" />
    );
  }
  if (!clothingItems) {
    return null;
  }
  if (!notConfirmedLaundries) {
    return null;
  }
  return (
    <>
      {isAllowed ? (
        <>
          <ConfirmationDialog />
          <OrderModal
            clothingItems={clothingItems}
            setIsOrderPending={setIsOrderPending}
          />
          {notConfirmedLaundries.length !== 0 ? (
            <CustomCardWithHeader title="New Order" icon={Package}>
              <NotFoundPage />
            </CustomCardWithHeader>
          ) : (
            <CustomCardWithHeader title="New Order" icon={Package}>
              <div className="w-full mt-2">
                <OrderItemAccordian
                  data={topwearClothing}
                  title="Top Wear Clothing"
                  defaultOpen
                />
                <OrderItemAccordian
                  data={bottomwearClothing}
                  title="Bottom Wear Clothing"
                  defaultOpen
                />
                <OrderItemAccordian
                  data={householdItems}
                  title="Household Items"
                />
                <OrderItemAccordian
                  data={outwearClothing}
                  title="Outwear & Accessories"
                />
              </div>

              <div
                className="w-full mt-8 flex flex-col md:flex-row items-center justify-between gap-y-4"
                style={{ WebkitUserSelect: "none", userSelect: "none" }}
              >
                <span className="text-xl font-bold">Order Summary</span>
                <div className="flex items-center gap-x-4">
                  <Button
                    className="flex items-center hover:bg-[#66BB6A] bg-[#43A047] transition"
                    disabled={items.length === 0 || orderPending}
                    onClick={open}
                  >
                    <CheckCircle2 className="size-4 md:size-6" />
                    {items.length === 0 ? "No Items" : "Continue"}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center"
                    disabled={items.length === 0 || orderPending}
                    onClick={handleReset}
                  >
                    <TrashIcon className="size-4 md:size-6" />
                    <span>Reset</span>
                  </Button>
                </div>
              </div>
              <DottedSeparator
                dotSize="4"
                gapSize="8"
                className="my-4 bg-neutral-600"
              />
              <div className="flex justify-center flex-col gap-y-4 ">
                {orderPending ? (
                  <div className="w-full h-32 flex items-center justify-center flex-col gap-x-4 backdrop-blur-md">
                    <Loader2 className="size-6 md:size-8 animate-spin" />
                    <span className="text-muted-foreground font-semibold">
                      Placing Order
                    </span>
                  </div>
                ) : (
                  <OrderItemDescription />
                )}
              </div>
            </CustomCardWithHeader>
          )}
        </>
      ) : (
        <CustomCardWithHeader title="New Order" icon={Package}>
          <NotAllowedPage type="student" />
        </CustomCardWithHeader>
      )}
    </>
  );
};
