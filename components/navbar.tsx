"use client";

import { CalendarCheck2, HelpCircle, HomeIcon, Package } from "lucide-react";
import { NavItem } from "./nav-item";
import { FullUser } from "@/types/auth";
import {
  MdHistory,
  MdOutlineReport,
  MdOutlineReportProblem,
} from "react-icons/md";
export const Navbar = ({ user }: { user: FullUser }) => {
  const student = user?.role === "student";
  const hostelOnlyAccess = user?.role === "hostelStaff";
  const plantAndHostelAccess = user?.role === "plantStaff";
  const adminAccess = user?.role === "admin";
  return (
    <div className="hidden md:flex px-4 py-3 items-center gap-x-8 rounded-2xl border bg-white">
      {student && (
        <>
          <NavItem icon={HomeIcon} title="Home" href="/student" />
          <NavItem icon={Package} title="New Order" href="/student/new-order" />
          <NavItem icon={MdHistory} title="History" href="/student/history" />
          <NavItem
            icon={HelpCircle}
            title="Raise an Issue"
            href="/student/issue"
          />
        </>
      )}
      {hostelOnlyAccess && (
        <>
          <NavItem icon={HomeIcon} title="Home" href="/hostel-staff" />
          <NavItem
            icon={MdOutlineReportProblem}
            title="Missing Items"
            href="/hostel-staff/missing"
          />
          <NavItem
            icon={HelpCircle}
            title="Issues"
            href="/hostel-staff/issues"
          />
        </>
      )}
      {/* TODO PLANT ONLY ACCESS AND ADMIN ACCESS */}
      {plantAndHostelAccess && (
        <>
          <NavItem icon={HomeIcon} title="Home" href="/plant-staff" />
          {/* <NavItem
            icon={MdHistory}
            title="History"
            href="/plant-staff/history"
          /> */}
          <NavItem
            icon={MdOutlineReport}
            title="Missing Items"
            href="/plant-staff/missing"
          />
        </>
      )}
    </div>
  );
};
