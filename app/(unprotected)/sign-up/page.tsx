import { getCurrentUser } from "@/actions/getCurrentUser";
import { SignUpClient } from "../_components/sign-up-client";
import { redirect } from "next/navigation";
import { getAllRoomNo } from "@/actions/get-all-room-no";

export default async function SignUpPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }
  const rooms = await getAllRoomNo();
  console.log(rooms);

  return <SignUpClient rooms={rooms} />;
}
