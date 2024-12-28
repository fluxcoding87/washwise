/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hostel, Laundry } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { GroupedData } from "./client";
import { format } from "date-fns";
import { CellAction } from "./cell-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<GroupedData>[] = [
  {
    accessorKey: "name",
    header: "Hostel Name",
  },
  {
    accessorKey: "arrived_on",
    enableSorting: true,
    header: "Arrived On",
    cell: ({ row }) => {
      const date = row.original.arrived_on;
      return <div>{format(date, "dd MMM, EEEE")}</div>;
    },
  },
  {
    accessorKey: "total_qty",
    header: "Total Quantity",
    cell: ({ row }) => {
      return <div className="">{row.original.total_qty}</div>;
    },
  },
  {
    accessorKey: "plant_confirmed_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Confirmed On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const confirmedTime = row.original.plant_confirmed_time;
      return (
        <div>
          {confirmedTime
            ? format(confirmedTime, "dd MMM, EEEE")
            : "Not Confirmed"}
        </div>
      );
    },
  },
  {
    id: "id",
    cell: ({ row }) => {
      return (
        <CellAction
          id={row.original.hostel_id}
          date={new Date(row.original.arrived_on)}
        />
      );
    },
  },
];
