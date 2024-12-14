import { getCurrentUser } from "@/actions/getCurrentUser";
import { RequestClient } from "../_components/requestclient";
import { redirect } from "next/navigation";

export default async function RequestAccessPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/home");
  }

  return <RequestClient />;
}
