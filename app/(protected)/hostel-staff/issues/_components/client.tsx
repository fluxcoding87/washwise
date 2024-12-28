"use client";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { HelpCircle } from "lucide-react";
import { useGetIssuesByHostelId } from "../_hooks/use-get-issues-by-hostel-id";
import { DataTable } from "@/components/data-table";
import { useCallback, useEffect, useState } from "react";
import { columns } from "./columns";

export const HostelStaffIssuesClient = () => {
  const [roomNo, setRoomNo] = useState<string>();
  const [apiReqRoom, setApiReqRoom] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetIssuesByHostelId(
    selectedDate,
    page,
    apiReqRoom
  );

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
};
