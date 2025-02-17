import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons/lib";
import { roleBasedPaths } from "./nav-item";

interface MobileSidebarItemProps {
  icon: LucideIcon | IconType;
  title: string;
  href: string;
}

export const MobileSidebarItem = ({
  icon: Icon,
  title,
  href,
}: MobileSidebarItemProps) => {
  const pathname = usePathname();
  const isHomeItem =
    roleBasedPaths.includes(pathname) && roleBasedPaths.includes(href);
  const isActive = pathname.startsWith(href) && !roleBasedPaths.includes(href);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center p-2 gap-x-4 border rounded-md font-semibold transition hover:text-primary",
        (isHomeItem || isActive) &&
          "text-primary hover:text-primary ring-1 ring-primary"
      )}
    >
      <Icon className="size-5" />
      <span>{title}</span>
    </Link>
  );
};
