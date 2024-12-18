"use client";

import { CellAction } from "@/components/cell-action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FullLaundry } from "@/types/clothing";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ExternalLink, MoreHorizontal, Trash } from "lucide-react";

export const HostelStaffColumns: ColumnDef<FullLaundry>[] = [
  {
    accessorKey: "user.room_no",
    header: "Room",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.user.room_no}</span>;
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
          {/* <span>{time}</span> */}
        </div>
      );
    },
  },
  {
    accessorKey: "total_quantity",
    header: "Total",
    cell: ({ row }) => {
      return <div className="">{row.original.total_quantity}</div>;
    },
  },
  {
    id: "id",
    cell: ({ row }) => {
      return <CellAction id={row.original.id} />;
    },
  },
];
