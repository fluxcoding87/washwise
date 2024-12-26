"use client";
import { IconType } from "react-icons/lib";
import { DayTime } from "./day-time";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { LucideIcon } from "lucide-react";
import { HiOutlineRefresh } from "react-icons/hi";

interface CardWithHeaderProps {
  children?: React.ReactNode;
  icon?: IconType | LucideIcon;
  title: string;
}

export const CustomCardWithHeader = ({
  children,
  icon: Icon = HiOutlineRefresh,
  title,
}: CardWithHeaderProps) => {
  return (
    <Card className="shadow-none border-none">
      <CardHeader className="p-0 py-4 md:p-6">
        <CardTitle className="flex flex-col-reverse gap-y-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center md:justify-start justify-center gap-x-2 px-4">
            <Icon className="hidden sm:block sm:size-5 md:size-6" />
            <span className="text-lg text-center md:text-xl">{title}</span>
          </div>
          <Separator className="md:hidden" />
          <div className="flex items-center justify-center">
            <DayTime />
          </div>
        </CardTitle>
      </CardHeader>
      <Separator className="bg-gray-300 hidden md:block" />

      <CardContent className="p-0">
        <div className="mt-6 px-2 md:p-6">{children}</div>
      </CardContent>
    </Card>
  );
};
