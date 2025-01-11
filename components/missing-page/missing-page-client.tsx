"use client";

import { MdOutlineReportProblem } from "react-icons/md";
import { CustomCardWithHeader } from "../custom-card-with-header";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useGetMissingItems } from "@/hooks/missing-items/use-get-missing-items";
import { useGetHostels } from "@/hooks/hostel/use-get-hostels";
import { DataTable } from "./data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { columns } from "./columns";

interface MissingPageClientProps {
  type: "hostelStaff" | "plantStaff";
}

export const MissingPageClient = ({ type }: MissingPageClientProps) => {
  const { data: hostels, isLoading: isHostelsLoading } = useGetHostels();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const session = useSession();
  const [hostelId, setHostelId] = useState<string | undefined | null>();
  const { data: missingItems, isLoading: isMissingItemsLoading } =
    useGetMissingItems(selectedDate, hostelId);
  const isLoading = isHostelsLoading || isMissingItemsLoading;
  if (session.status === "loading") {
    return <div className="w-full h-44 bg-neutral-400 animate-pulse" />;
  }
  const handleSelectedDate = (date: Date) => {
    setSelectedDate(date);
  };
  return (
    <CustomCardWithHeader title="Missing Items" icon={MdOutlineReportProblem}>
      {type === "plantStaff" && (
        <Select onValueChange={(val) => setHostelId(val)}>
          <SelectTrigger defaultValue={hostelId ?? undefined}>
            <SelectValue placeholder="Select a Hostel" />
          </SelectTrigger>
          <SelectContent>
            {hostels &&
              hostels.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
      <DataTable
        columns={columns}
        data={missingItems ?? []}
        isLoading={isLoading}
        handleSelectedDate={handleSelectedDate}
      />
    </CustomCardWithHeader>
  );
};
