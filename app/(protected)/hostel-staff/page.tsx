import { getSession } from "@/actions/getCurrentUser";
import { StaffClient } from "../_components/staff-client";
import { redirect } from "next/navigation";

export default async function HostelStaffPage() {
  const session = await getSession();
  const role = session?.user.role;
  if (role === "student") {
    redirect("/");
  }
  return <StaffClient />;
}
