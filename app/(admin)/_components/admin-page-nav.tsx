"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { MobileSidebarItem } from "@/components/mobile-sidebar-item";
import { NavItem } from "@/components/nav-item";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import {
  HomeIcon,
  Loader2,
  LogOutIcon,
  PlusCircleIcon,
  Settings2Icon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import {
  MdEmojiPeople,
  MdHistory,
  MdOutlineReportProblem,
  MdReportProblem,
} from "react-icons/md";

export const AdminPageNav = () => {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <>
      <div className="bg-neutral-200/70 flex-col flex">
        <div className="w-full">
          <Link
            href={"/"}
            className="flex items-center gap-x-1.5 justify-center px-2 pb-4 pt-6"
          >
            <div className="size-7 md:size-8 relative">
              <Image fill src="/logo.svg" alt="logo" />
            </div>
            <div className="font-extrabold tracking-tight text-xl md:text-2xl text-[#007DFC]">
              Washwise
            </div>
          </Link>
          <div className="text-gray-700 font-extrabold text-xl tracking-wide text-center">
            Admin Panel
          </div>
        </div>
        <DottedSeparator className="my-4" />
      </div>
      <div className="flex flex-col gap-y-4 p-4 bg-neutral-200/70 w-full">
        <MobileSidebarItem title="Home" href="/admin" icon={HomeIcon} />
        <MobileSidebarItem
          title="View Laundries"
          href="/admin/laundries"
          icon={MdHistory}
        />
        <MobileSidebarItem
          title="Issues"
          href="/admin/issues"
          icon={MdReportProblem}
        />
        <MobileSidebarItem
          title="Staff Details"
          href="/admin/staff-details"
          icon={MdEmojiPeople}
        />

        <MobileSidebarItem
          title="Organization Settings"
          href="/admin/settings"
          icon={Settings2Icon}
        />
        <MobileSidebarItem
          title="Missing Items"
          href="/admin/missing-items"
          icon={AiOutlineQuestionCircle}
        />
        <MobileSidebarItem
          title="Add New Staff"
          href="/admin/staff-sign-up"
          icon={PlusCircleIcon}
        />
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-y-2 border border-primary p-4 rounded-xl bg-white">
            <div className="flex items-center gap-x-4">
              <div className="flex items-center justify-center size-14 rounded-full p-2 relative bg-[#3F51B5]">
                {user?.image ? (
                  <Image fill src={user.image} alt="user image" />
                ) : (
                  <span className="font-light text-white text-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="space-y-0">
                <div className="font-semibold text-base">{user?.name}</div>
                <div className="text-xs text-gray-600 -mt-2">{user?.email}</div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                className="w-full bg-amber-600 text-white hover:bg-amber-600/60"
                variant="secondary"
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
              >
                <LogOutIcon className="size-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
