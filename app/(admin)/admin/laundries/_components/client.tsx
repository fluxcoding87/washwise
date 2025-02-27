"use client";

import { DataTable } from "@/app/(protected)/hostel-staff/_components/data-table";
import { HostelStaffClient } from "@/app/(protected)/hostel-staff/_components/hostel-staff-client";
import { HostelStaffColumns } from "@/app/(protected)/hostel-staff/_components/hostel-staff-columns";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetHostels } from "@/hooks/hostel/use-get-hostels";
import { useEffect, useState } from "react";

export const AdminLaundryPageClient = () => {
  const [isServer, setIsServer] = useState(true);
  const { data: hostels, isLoading: isHostelsLoading } = useGetHostels();
  const [hostelId, setHostelId] = useState<string | undefined>(
    hostels && hostels.length > 0 ? hostels[0].id : undefined
  );
  useEffect(() => {
    setIsServer(false);
  }, []);
  useEffect(() => {
    if (hostels && hostels.length > 0 && !isHostelsLoading) {
      setHostelId(hostels[0].id);
    }
  }, [hostels, isHostelsLoading]);
  if (isServer) {
    return null;
  }
  return (
    <CustomCardWithHeader title="View Laundries">
      {hostels && hostels.length > 0 && hostelId && (
        <>
          <Select
            defaultValue={hostels[0].id}
            onValueChange={(value) => {
              setHostelId(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a hostel" />
            </SelectTrigger>
            <SelectContent>
              {hostels.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Separator className="my-4 bg-neutral-200" />
          <HostelStaffClient hostelId={hostelId} type="admin" />
        </>
      )}
    </CustomCardWithHeader>
  );
};
