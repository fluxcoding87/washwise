import { Hostel, Laundry } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { GroupedData } from "./client";
import { format } from "date-fns";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<GroupedData>[] = [
  {
    accessorKey: "name",
    header: "Hostel Name",
  },
  {
    accessorKey: "arrived_on",
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
    header: "Confirmed",
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
          date={row.original.arrived_on}
        />
      );
    },
  },
];
