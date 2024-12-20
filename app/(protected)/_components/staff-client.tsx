"use client";

import { useSession } from "next-auth/react";

import { HostelStaffClient } from "../hostel-staff/_components/hostel-staff-client";
import { redirect } from "next/navigation";

export const StaffClient = () => {
  const session = useSession();
  if (session.status === "loading") {
    return (
      <div className="w-full h-[400px] md:h-[500px] xl:h-[600px] bg-neutral-200 animate-pulse rounded-md" />
    );
  }
  if (
    session.data?.user.role === "hostelStaff" &&
    session.data.user.hostel_id
  ) {
    return <HostelStaffClient hostelId={session.data.user.hostel_id} />;
  }
  if (session.data?.user.role === "plantStaff") {
    redirect("/plant-staff");
  }
  return null;
};
