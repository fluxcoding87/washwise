"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export const ProtectedPageClient = () => {
  const session = useSession();

  const role = session.data?.user.role;
  if (role === "hostelStaff") {
    redirect("/hostel-staff");
  } else if (role === "plant-staff") {
    redirect("/plant-staff");
  } else if (role === "student") {
    redirect("/student");
  } else if (role === "admin") {
    redirect("/admin");
  }
  return null;
};
