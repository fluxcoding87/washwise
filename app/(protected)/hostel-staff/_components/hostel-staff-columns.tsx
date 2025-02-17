"use client";

import { CellAction } from "@/components/cell-action";
import { Button } from "@/components/ui/button";
import { Laundry } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

export const HostelStaffColumns: ColumnDef<Laundry>[] = [
  {
    accessorKey: "room_no",
    header: "Room",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.room_no}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Placed On",
    cell: ({ row }) => {
      const displayDate = format(row.original.createdAt, "EEEE, h:mm a");
      return (
        <div className="font-medium flex flex-col md:flex-row md:items-center md:gap-x-2 md:w-fit w-[130px]">
          <span>{displayDate}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "total_quantity",
    header: "Total",
    cell: ({ row }) => {
      return <div className="font-semibold">{row.original.total_quantity}</div>;
    },
  },
  {
    accessorKey: "confirmed_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Confirmed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const confirmedTime = row.original.confirmed_time;
      return (
        <div className="font-semibold">
          {confirmedTime ? (
            format(confirmedTime, "EEEE, h:mm a")
          ) : (
            <div>Not Confirmed</div>
          )}
        </div>
      );
    },
  },
  {
    id: "id",
    cell: ({ row }) => {
      return (
        <CellAction
          id={row.original.id}
          roomNo={row.original.room_no!}
          placedOn={row.original.createdAt}
          laundryId={row.original.id}
          type="hostelStaff"
        />
      );
    },
  },
];
