"use client";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { Navbar } from "@/components/navbar";
import { UserButton } from "@/components/user-button";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const NavClient = () => {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex-1 ml-6 p-8 bg-neutral-200 animate-pulse rounded-md"></div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <nav className="flex items-center justify-between">
        <Navbar user={user} />
        <MobileSidebar user={user} isLoading={isLoading} />
      </nav>
      <div className="hidden md:block">
        <UserButton user={user} isLoading={isLoading} />
      </div>
    </>
  );
};
