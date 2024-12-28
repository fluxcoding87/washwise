/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "./data-table";

import { useGetLaundriesByHostelId } from "@/hooks/clothing/use-get-laundries-by-hostel-id";
import { HiOutlineRefresh } from "react-icons/hi";
import { HostelStaffColumns } from "./hostel-staff-columns";

import { useCallback, useEffect, useState } from "react";
import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { DottedSeparator } from "@/components/dotted-separator";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { useBulkConfirmLaundries } from "@/hooks/hostel-staff/use-bulk-confirm-laundries";
import { useQueryClient } from "@tanstack/react-query";
import { Laundry } from "@prisma/client";

export const HostelStaffClient = ({ hostelId }: { hostelId: string }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [confirmed, setConfirm] = useState(false);
  const [roomNo, setRoomNo] = useState<string>();
  const [apiReqRoom, setApiReqRoom] = useState<string | undefined>();
  const [ConfirmationDialog, confirm] = useConfirm(
    `This action is irreversible! and will approve all the orders that are displayed`,
    ""
  );
  const queryClient = useQueryClient();
  const { mutate, isPending } = useBulkConfirmLaundries();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetLaundriesByHostelId(
    hostelId,
    selectedDate,
    page,
    apiReqRoom
  );
  const [laundries, setLaundries] = useState<Laundry[]>();
  useEffect(() => {
    if (data)
      if (data.data) {
        setLaundries(data.data);
      }
  }, [data]);
  useEffect(() => {
    if (laundries && laundries.length > 0) {
      const isConfirmedRemaining = laundries.reduce((acc, curr) => {
        return acc || curr.confirmed_time === null;
      }, false);
      if (isConfirmedRemaining) {
        setConfirm(false);
      } else {
        setConfirm(true);
      }
    }
  }, [laundries]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setApiReqRoom(roomNo);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [roomNo]);
  const handleSelectedDate = (value: Date) => {
    setSelectedDate(value);
    setPage(1);
  };
  const handleRoomChange = (value: string) => {
    setRoomNo(value);
  };
  const handleSetPage = useCallback((value: number) => {
    setPage(value);
  }, []);
  const handleConfirmOrder = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    } else {
      const ids: string[] = [];
      if (laundries) {
        laundries.forEach((item) => {
          if (item.confirmed_time) {
            return false;
          } else {
            return ids.push(item.id);
          }
        });
        if (ids && ids.length > 0) {
          mutate(
            { laundryIds: ids },
            {
              onSuccess: () => {
                setConfirm(true);
                queryClient.invalidateQueries({
                  queryKey: [
                    "hostel_laundries",
                    hostelId,
                    selectedDate,
                    page,
                    roomNo ?? null,
                  ],
                });
              },
            }
          );
        }
      }
    }
  };
  return (
    <CustomCardWithHeader icon={HiOutlineRefresh} title="Recent Placed Orders">
      <ConfirmationDialog />
      <DataTable
        columns={HostelStaffColumns}
        isLoading={isLoading || isPending}
        data={laundries ?? []}
        handleSelectedDate={handleSelectedDate}
        handleRoomChange={handleRoomChange}
        handleSetPage={handleSetPage}
        metaData={data?.meta}
      />
      <DottedSeparator
        dotSize="4"
        gapSize="8"
        className="my-4 bg-neutral-600"
      />
      <button
        disabled={isPending || isLoading || confirmed}
        onClick={handleConfirmOrder}
        className={cn(
          "w-full p-4 bg-sky-700 cursor-pointer font-bold text-lg rounded-lg text-white flex items-center justify-center gap-x-4 hover:bg-sky-600 hover:opacity-75 transition",
          confirmed && "bg-green-600 hover:bg-green-700 hover:opacity-95"
        )}
      >
        <CheckCircle2 />
        <span className="text-sm sm:text-base md:text-lg">
          {confirmed
            ? "Laundries Approved by Hostel Staff"
            : "Confirm All Orders"}
        </span>
      </button>
    </CustomCardWithHeader>
  );
};
