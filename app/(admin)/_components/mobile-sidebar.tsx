import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { AdminPageNav } from "./admin-page-nav";
export const MobileSideBar = () => {
  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <MenuIcon className="size-6" />
      </SheetTrigger>
      <SheetHeader className="sr-only">
        <SheetTitle className="sr-only">View</SheetTitle>
      </SheetHeader>
      <SheetContent side="left" className="p-0 overflow-y-scroll">
        <AdminPageNav />
      </SheetContent>
    </Sheet>
  );
};
