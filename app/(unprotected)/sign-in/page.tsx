import { getCurrentUser } from "@/actions/getCurrentUser";
import { SignInClient } from "../_components/sign-in-client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import db from "@/lib/db";

// Disable caching to render dynamically
export const revalidate = 0; // or cache: 'no-store'

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <>
      <SignInClient />
    </>
  );
}
