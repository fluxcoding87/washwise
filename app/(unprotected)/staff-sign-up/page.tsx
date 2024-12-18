import { getCurrentUser } from "@/actions/getCurrentUser";
import { StaffSignUpClient } from "./_components/staff-sign-up-client";
import { redirect } from "next/navigation";

export default async function StaffSignUpPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }
  return <StaffSignUpClient />;
}
