"use client";

import Lottie from "lottie-react";
import notFoundData from "@/public/not-found.json";
export const NotFoundComponent = () => {
  return (
    <div className="flex flex-col gap-y-6 items-center justify-center h-[60dvh] border rounded-md">
      <Lottie animationData={notFoundData} loop />
      <h3 className="text-xl font-bold">Not Found</h3>
    </div>
  );
};
