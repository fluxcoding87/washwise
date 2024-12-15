import { getCurrentUser } from "@/actions/getCurrentUser";
import { ProtectedPageClient } from "./_components/client";
import { redirect } from "next/navigation";

export default async function ProtectedHomePage() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  return <ProtectedPageClient />;
}
