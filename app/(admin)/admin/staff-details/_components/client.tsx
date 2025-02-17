"use client";

import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStaffDetails } from "@/hooks/admin/use-get-staff-details";
import { useGetHostels } from "@/hooks/hostel/use-get-hostels";
import { useState } from "react";
import { MdEmojiPeople } from "react-icons/md";
import { columns } from "./columns";

export const AdminStaffDetailsPageClient = () => {
  const { data: hostels, isLoading } = useGetHostels();
  const [selectedHostelId, setSelectedHostelId] = useState<string>("all");
  const { data: staffDetails, isLoading: isStaffDetailsLoading } =
    useGetStaffDetails(selectedHostelId);

  return (
    <CustomCardWithHeader title="Staff Details" icon={MdEmojiPeople}>
      {isStaffDetailsLoading ? (
        <div className="w-full h-[500px] bg-neutral-300 animate-pulse rounded-xl" />
      ) : (
        <div className="">
          {hostels && hostels.length > 0 && (
            <Select
              onValueChange={(val) => {
                setSelectedHostelId(val);
              }}
              defaultValue={selectedHostelId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a hostel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hostels</SelectItem>
                <SelectItem value="plantStaff">Plant Staff</SelectItem>
                {hostels.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="p-4">
            <DataTable data={staffDetails ?? []} columns={columns} />
          </div>
        </div>
      )}
    </CustomCardWithHeader>
  );
};
