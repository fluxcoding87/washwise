import { getCurrentUser } from "@/actions/getCurrentUser";
import { HomePageClient } from "./_components/client";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/home");
  }
  return <HomePageClient />;
}
