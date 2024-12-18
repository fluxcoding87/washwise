"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons/lib";

interface NavItemProps {
  icon: LucideIcon | IconType;
  title: string;
  href: string;
}

export const NavItem = ({ icon: Icon, title, href }: NavItemProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-2 font-medium tracking-tight hover:text-primary transition cursor-pointer text-gray-700",
        pathname === href && "text-primary hover:text-primary"
      )}
    >
      <Icon className="size-5" />
      <span>{title}</span>
    </Link>
  );
};
