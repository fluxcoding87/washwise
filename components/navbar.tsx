"use client";

import { CalendarCheck2, HelpCircle, HomeIcon, Package } from "lucide-react";
import { NavItem } from "./nav-item";
import { FullUser } from "@/types/auth";
import { MdHistory } from "react-icons/md";
export const Navbar = ({ user }: { user: FullUser }) => {
  const student = user?.role === "student";
  const hostelOnlyAccess = user?.role === "hostelStaff";
  const plantAndHostelAccess = user?.role === "plantStaff";
  const adminAccess = user?.role === "admin";
  return (
    <div className="hidden md:flex px-4 py-3 items-center gap-x-8 rounded-2xl border bg-white">
      {student && (
        <>
          <NavItem icon={HomeIcon} title="Home" href="/" />
          <NavItem icon={Package} title="New Order" href="/new-order" />
          <NavItem icon={CalendarCheck2} title="Pickups" href="/pickups" />
          <NavItem icon={HelpCircle} title="Raise an Issue" href="/issue" />
        </>
      )}
      {hostelOnlyAccess && (
        <>
          <NavItem icon={HomeIcon} title="Home" href="/hostel-staff" />
          <NavItem
            icon={MdHistory}
            title="History"
            href="/hostel-staff/history"
          />
          <NavItem
            icon={CalendarCheck2}
            title="Pickups"
            href="/hostel-staff/pickups"
          />
          <NavItem
            icon={HelpCircle}
            title="Raise an Issue"
            href="/hostel-staff/issue"
          />
        </>
      )}
      {/* TODO PLANT ONLY ACCESS AND ADMIN ACCESS */}
    </div>
  );
};
