"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  BuildingIcon,
  DoorOpen,
  LayersIcon,
  Loader,
  LogOutIcon,
} from "lucide-react";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { DottedSeparator } from "./dotted-separator";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { FullUser } from "@/types/auth";

interface UserButtonProps {
  user: FullUser;
  isLoading: boolean;
}

export const UserButton = ({ user, isLoading }: UserButtonProps) => {
  if (isLoading) {
    return (
      <div className="hidden md:flex items-center justify-center size-10 rounded-full p-2 relative bg-[#3F51B5] animate-pulse"></div>
    );
  }
  if (!user) {
    return (
      <div className="hidden md:flex items-center justify-center size-10 rounded-full p-2 relative bg-[#3F51B5] animate-pulse"></div>
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
    <Popover>
      <PopoverTrigger className="hidden md:block">
        <div className="flex items-center justify-center size-10 rounded-full p-2 relative bg-[#3F51B5]">
          {user.image ? (
            <Image fill src={user.image} alt="user image" />
          ) : (
            <span className="font-light text-white">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="border-none outline-none ring-1 ring-primary p-0">
        <div className="flex flex-col items-center justify-center gap-y-2 p-4">
          <div className="flex items-center justify-center size-14 rounded-full p-2 relative bg-[#3F51B5]">
            {user.image ? (
              <Image fill src={user.image} alt="user image" />
            ) : (
              <span className="font-light text-white text-xl">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="font-semibold text-base text-center">{user.name}</div>
          <div className="text-xs text-gray-600 -mt-2">{user.email}</div>
        </div>
        <Separator className="-mt-2 mb-4" />
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
                    {user.staff.role === "hostel"
                      ? "Hostel Access Only"
                      : "Plant and Hostel Access"}
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
              {user.staff?.role === "both"
                ? "Hostel & Plant Access"
                : "Hostel Access"}
            </div>
          </div>
        )}

        <DottedSeparator />
        <div className="flex items-center justify-center p-2">
          <Button
            className="p-4 flex items-center justify-center gap-x-2 w-full"
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
          >
            <LogOutIcon className="size-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
