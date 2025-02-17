"use client";

import {
  BuildingIcon,
  DoorOpen,
  LayersIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

import Image from "next/image";
import { DottedSeparator } from "./dotted-separator";
import { CalendarCheck2, HelpCircle, HomeIcon, Package } from "lucide-react";
import { signOut } from "next-auth/react";

import { MobileSidebarItem } from "./mobile-sidebar-item";
import { FullUser } from "@/types/auth";
import { cn } from "@/lib/utils";
import { MdHistory } from "react-icons/md";

interface MobileSidebarProps {
  user: FullUser;
  isLoading: boolean;
}

export const MobileSidebar = ({ user, isLoading }: MobileSidebarProps) => {
  const student = user?.role === "student";
  const hostelOnlyAccess = user?.role === "hostelStaff";
  const plantAndHostelAccess = user?.role === "plantStaff";
  if (isLoading) {
    return (
      <div className="block md:hidden animate-pulse">
        <MenuIcon className="size-6" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="block md:hidden animate-pulse">
        <MenuIcon className="size-6" />
      </div>
    );
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
            {student && (
              <>
                <MobileSidebarItem
                  icon={HomeIcon}
                  title="Home"
                  href="/student"
                />
                <MobileSidebarItem
                  icon={Package}
                  title="New Order"
                  href="/student/new-order"
                />
                <MobileSidebarItem
                  icon={MdHistory}
                  title="History"
                  href="/student/history"
                />
                <MobileSidebarItem
                  icon={HelpCircle}
                  title="Raise an Issue"
                  href="/student/issue"
                />
              </>
            )}
            {hostelOnlyAccess && (
              <>
                <MobileSidebarItem
                  icon={HomeIcon}
                  title="Home"
                  href="/hostel-staff"
                />
                <MobileSidebarItem
                  icon={CalendarCheck2}
                  title="Pickups"
                  href="/hostel-staff/pickups"
                />
                <MobileSidebarItem
                  icon={HelpCircle}
                  title="Raise an Issue"
                  href="/hostel-staff/issue"
                />
              </>
            )}
            {/* TODO PLANT ONLY ACCESS AND ADMIN ACCESS */}
            {plantAndHostelAccess && (
              <>
                <MobileSidebarItem
                  icon={HomeIcon}
                  title="Home"
                  href="/plant-staff"
                />
                {/* <MobileSidebarItem
                       icon={MdHistory}
                       title="History"
                       href="/plant-staff/history"
                     /> */}
                <MobileSidebarItem
                  icon={CalendarCheck2}
                  title="Pickups"
                  href="/plant-staff/pickups"
                />
                <MobileSidebarItem
                  icon={HelpCircle}
                  title="Raise an Issue"
                  href="/plant-staff/issue"
                />
              </>
            )}
            <div
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="flex items-center p-2 gap-x-4 border rounded-md font-semibold transition hover:text-primary"
            >
              <LogOutIcon className="size-5" />
              <span>Logout</span>
            </div>
          </div>
          <div className="flex items-center justify-center pr-16 mt-4">
            {user.hostel ? (
              <div
                className={cn(
                  "pb-2 pl-12 text-sm tracking-tight space-y-2",
                  user.staff && user.hostel && "p-0 py-2 -mt-2"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-x-4 px-4",
                    user.staff &&
                      user.hostel &&
                      "font-semibold justify-center text-[15px]"
                  )}
                >
                  <BuildingIcon
                    className={cn(
                      "size-4 text-primary",
                      user.staff && user.hostel && "hidden"
                    )}
                  />
                  {user.hostel.name} (
                  {user.hostel.gender_type.charAt(0).toLowerCase() === "m"
                    ? "Boys"
                    : "Girls"}
                  )
                </div>
                {user.staff ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-x-4 px-4 font-medium">
                      <span>Group {user.staff.group}</span>
                    </div>
                    <div className="text-sm font-semibold flex items-center justify-center gap-x-4 px-4 text-muted-foreground">
                      <span>
                        {user.role === "plantStaff"
                          ? "Hostel & Plant Access"
                          : user.role === "hostelStaff"
                          ? "Hostel Access"
                          : user.role === "admin" && "Admin"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-x-4 px-4">
                      <LayersIcon className="size-4 text-primary" />
                      <span>{floor}</span>
                    </div>
                    <div className="flex items-center gap-x-4 px-4">
                      <DoorOpen className="size-4 text-primary" />
                      <span>Room {user.room_no}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-1 -mt-2 py-2">
                <div className="flex items-center justify-center font-semibold text-[15px]">
                  {user.staff?.organization.name}
                </div>
                <div className="flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {user.role === "plantStaff"
                    ? "Hostel & Plant Access"
                    : user.role === "hostelStaff"
                    ? "Hostel Access"
                    : user.role === "admin" && "Admin"}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
