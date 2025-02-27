import { getCurrentUser } from "@/actions/getCurrentUser";
import { SignUpClient } from "../_components/sign-up-client";
import { redirect } from "next/navigation";
import { getAllRoomNo } from "@/actions/get-all-room-no";

// Disable caching to render dynamically
export const revalidate = 0; // or cache: 'no-store'

export default async function SignUpPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }
  const rooms = await getAllRoomNo();

  return <SignUpClient rooms={rooms} />;
}
