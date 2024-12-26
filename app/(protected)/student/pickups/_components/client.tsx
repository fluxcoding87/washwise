"use client";

import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { MdLocalShipping } from "react-icons/md";

export const PickupPageClient = () => {
  return (
    <CustomCardWithHeader title="Pickups" icon={MdLocalShipping}>
      <div></div>
    </CustomCardWithHeader>
  );
};
