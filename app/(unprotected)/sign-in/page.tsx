import { getCurrentUser } from "@/actions/getCurrentUser";
import { SignInClient } from "../_components/sign-in-client";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }
  return <SignInClient />;
}
