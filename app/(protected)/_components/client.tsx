"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export const ProtectedPageClient = () => {
  const session = useSession();

  const role = session.data?.user.role;

  if (role === "hostelStaff") {
    redirect("/hostel-staff");
  }
  if (role === "plantStaff") {
    redirect("/plant-staff");
  }
  if (role === "student") {
    redirect("/student");
  }
  if (role === "admin") {
    redirect("/admin");
  }
  return null;
};
