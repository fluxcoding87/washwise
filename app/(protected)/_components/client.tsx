"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const ProtectedPageClient = () => {
  return (
    <div>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
};
