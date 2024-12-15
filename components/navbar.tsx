"use client";

import { CalendarCheck2, HelpCircle, HomeIcon, Package } from "lucide-react";
import { NavItem } from "./nav-item";

export const Navbar = () => {
  return (
    <div className="px-4 py-3 flex items-center gap-x-8 rounded-md border bg-white">
      <NavItem icon={HomeIcon} title="Home" href="/" />
      <NavItem icon={Package} title="New Order" href="/new-order" />
      <NavItem icon={CalendarCheck2} title="Pickups" href="/pickups" />
      <NavItem icon={HelpCircle} title="Raise an Issue" href="/issue" />
    </div>
  );
};
