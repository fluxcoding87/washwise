"use client";
import notAllowedAnimationData from "@/public/not-allowed.json";
import Lottie from "lottie-react";
export const NotAllowedPage = ({
  type = "student",
}: {
  type?: "student" | "staff";
}) => {
  return (
    <div className="p-10 flex flex-col gap-y-8 items-center justify-center">
      <Lottie
        animationData={notAllowedAnimationData}
        loop
        className="size-48"
      />
      <div className="text-center space-y-2">
        <div className="font-semibold text-gray-600 text-lg md:text-xl">
          {`Uh Oh! Looks like you cannot ${
            type === "student" ? "place an order currently" : ""
          }. Please Try
          Again after some time!`}
        </div>
        <div className="font-medium text-muted-foreground">
          Maybe today is not your laundry day check your calendar or time is
          past 5:30 PM
        </div>
      </div>
    </div>
  );
};
