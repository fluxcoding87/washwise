import { CellAction } from "@/components/cell-action";
import { LaundryWithClothes } from "@/types/clothing";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const hostelDateColumns: ColumnDef<LaundryWithClothes>[] = [
  {
    accessorKey: "room_no",
    header: "Room",
    size: 20,
    minSize: 100, // Ensuring minimum size
    maxSize: 200, // Maximum size
    enableResizing: true,
    cell: ({ row }) => (
      <span className="font-bold">{row.original.room_no}</span>
    ),
  },
  {
    accessorKey: "confirmed_time",
    header: "Hostel Confirmed",
    size: 30,
    minSize: 200,
    maxSize: 300,
    enableResizing: true,
    cell: ({ row }) =>
      row.original.confirmed_time && (
        <span className="font-semibold">
          {format(row.original.confirmed_time, "EEEE, dd MMM")}
        </span>
      ),
  },
  {
    accessorKey: "total_quantity",
    header: "Total",
    size: 15,
    minSize: 100,
    maxSize: 150,
    enableResizing: true,
    cell: ({ row }) => (
      <span className="font-semibold text-base tracking-wide">
        {row.original.total_quantity}
      </span>
    ),
  },
  {
    accessorKey: "plant_confirmed_time",
    header: "Plant Confirmed",
    size: 30,
    minSize: 200,
    maxSize: 300,
    enableResizing: true,
    cell: ({ row }) => {
      const date = row.original.plant_confirmed_time;
      return (
        <span className="font-semibold">
          {date ? format(date, "EEEE, MMM dd") : "Not Confirmed"}
        </span>
      );
    },
  },
  {
    id: "id",
    size: 5,
    minSize: 50,
    maxSize: 100,
    enableResizing: true,
    cell: ({ row }) => (
      <CellAction
        id={row.original.id}
        roomNo={row.original.room_no!}
        placedOn={row.original.createdAt!}
        type="plantStaff"
      />
    ),
  },
];
