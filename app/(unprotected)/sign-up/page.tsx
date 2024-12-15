import { getCurrentUser } from "@/actions/getCurrentUser";
import { SignUpClient } from "../_components/sign-up-client";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <SignUpClient />;
}
