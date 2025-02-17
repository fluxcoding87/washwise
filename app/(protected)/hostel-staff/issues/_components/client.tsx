"use client";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { HelpCircle } from "lucide-react";
import { useGetIssuesByHostelId } from "../_hooks/use-get-issues-by-hostel-id";
import { DataTable } from "@/components/data-table";
import { useCallback, useEffect, useState } from "react";
import { columns } from "./columns";
import { useGetHostels } from "@/hooks/hostel/use-get-hostels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HostelStaffIssuesClientProps {
  type?: "default" | "admin";
}

export const HostelStaffIssuesClient = ({
  type = "default",
}: HostelStaffIssuesClientProps) => {
  const { data: hostels, isLoading: isHostelsLoading } = useGetHostels();
  const [hostelId, setHostelId] = useState<string | undefined>(
    hostels && hostels.length > 0 ? hostels[0].id : undefined
  );
  const [roomNo, setRoomNo] = useState<string>();
  const [apiReqRoom, setApiReqRoom] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetIssuesByHostelId(
    selectedDate,
    page,
    apiReqRoom,
    type === "admin" ? hostelId : undefined
  );
  useEffect(() => {
    if (hostels && hostels.length > 0 && !isHostelsLoading) {
      setHostelId(hostels[0].id);
    }
  }, [hostels, isHostelsLoading]);
  const handleSelectedDate = (date: Date) => {
    setSelectedDate(date);
    setPage(1);
  };
  const handleRoomChange = (value: string) => {
    setRoomNo(value);
  };
  const handleSetPage = useCallback((value: number) => {
    setPage(value);
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setApiReqRoom(roomNo);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [roomNo]);
  if (type === "default") {
    return (
      <CustomCardWithHeader title="Issues" icon={HelpCircle}>
        <DataTable
          isLoading={isLoading}
          columns={columns}
          data={data?.data ?? []}
          handleSetPage={(val) => handleSetPage(val)}
          handleSelectedDate={handleSelectedDate}
          handleRoomChange={handleRoomChange}
          metaData={data?.meta}
        />
      </CustomCardWithHeader>
    );
  } else if (type === "admin") {
    return (
      <CustomCardWithHeader title="Issues" icon={HelpCircle}>
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

            <DataTable
              isLoading={isLoading}
              columns={columns}
              data={data?.data ?? []}
              handleSetPage={(val) => handleSetPage(val)}
              handleSelectedDate={handleSelectedDate}
              handleRoomChange={handleRoomChange}
              metaData={data?.meta}
            />
          </>
        )}
      </CustomCardWithHeader>
    );
  }
};
