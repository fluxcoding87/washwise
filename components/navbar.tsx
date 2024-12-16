"use client";

import { CalendarCheck2, HelpCircle, HomeIcon, Package } from "lucide-react";
import { NavItem } from "./nav-item";

export const Navbar = () => {
  return (
    <div className="hidden md:flex px-4 py-3 items-center gap-x-8 rounded-2xl border bg-white">
      <NavItem icon={HomeIcon} title="Home" href="/" />
      <NavItem icon={Package} title="New Order" href="/new-order" />
      <NavItem icon={CalendarCheck2} title="Pickups" href="/pickups" />
      <NavItem icon={HelpCircle} title="Raise an Issue" href="/issue" />
    </div>
  );
};
