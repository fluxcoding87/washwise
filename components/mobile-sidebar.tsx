"use client";

import {
  BuildingIcon,
  DoorOpen,
  LayersIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import Image from "next/image";
import { DottedSeparator } from "./dotted-separator";
import { CalendarCheck2, HelpCircle, HomeIcon, Package } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { MobileSidebarItem } from "./mobile-sidebar-item";

export const MobileSidebar = () => {
  const { data: user, isLoading } = useCurrentUser();
  if (isLoading) {
    return (
      <div className="block md:hidden animate-pulse">
        <MenuIcon className="size-6" />
      </div>
    );
  }
  if (!user) {
    return null;
  }
  let floor = "First Floor";
  if (user.floor?.startsWith("0")) {
    floor = "Ground Floor";
  } else if (user.floor?.startsWith("1")) {
    floor = "First Floor";
  } else if (user.floor?.startsWith("2")) {
    floor = "Second Floor";
  } else if (user.floor?.startsWith("3")) {
    floor = "Third Floor";
  } else if (user.floor?.startsWith("4")) {
    floor = "Fourth Floor";
  } else if (user.floor?.startsWith("5")) {
    floor = "Fifth Floor";
  } else if (user.floor?.startsWith("6")) {
    floor = "Sixth Floor";
  }
  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <MenuIcon className="size-6" />
      </SheetTrigger>
      <SheetContent side="right" className="py-4 px-0">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex flex-col justify-center gap-y-2 mt-5 w-full">
          <div className="flex items-center gap-x-2 px-6 py-4">
            <div className="flex items-center justify-center size-12 rounded-full p-2 relative bg-[#3F51B5]">
              {user.image ? (
                <Image fill src={user.image} alt="user image" />
              ) : (
                <span className="font-light text-white text-xl">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 text-left space-y-0">
              <div className="font-semibold text-base">{user.name}</div>
              <div className="text-xs text-gray-600 -mt-2">{user.email}</div>
            </div>
          </div>

          <DottedSeparator className="mt-2" dotSize="2" gapSize="3" />
          <div className="px-2 py-4 flex flex-col justify-center gap-y-4 text-sm">
            <MobileSidebarItem title="Home" icon={HomeIcon} href="/" />
            <MobileSidebarItem
              title="New Order"
              icon={Package}
              href="/new-order"
            />
            <MobileSidebarItem
              title="Pickups"
              icon={CalendarCheck2}
              href="/pickups"
            />
            <MobileSidebarItem
              title="Raise an Issue"
              icon={HelpCircle}
              href="/issue"
            />
            <div
              onClick={() => signOut()}
              className="flex items-center p-2 gap-x-4 border rounded-md font-semibold transition hover:text-primary"
            >
              <LogOutIcon className="size-5" />
              <span>Logout</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center">
              <span className="font-bold text-lg">
                {user.hostel.name} (
                {user.hostel.gender_type.charAt(0).toLowerCase() === "m"
                  ? "Boys"
                  : "Girls"}
                )
              </span>
            </div>
            <div className="max-w-fit mx-auto text-sm font-semibold py-4 space-y-3">
              <div className="flex items-center justify-between w-fit gap-x-2">
                <LayersIcon className="size-5 text-primary" />
                <span>{floor}</span>
              </div>
              <div className="flex items-center justify-between w-fit gap-x-2">
                <DoorOpen className="size-5 text-primary" />
                <span>Room {user.room_no}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
