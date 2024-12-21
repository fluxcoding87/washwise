import { CellAction } from "@/components/cell-action";
import { LaundryWithClothes } from "@/types/clothing";
import { LaundryByHostelAndDate } from "@/types/org";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const hostelDateColumns: ColumnDef<LaundryWithClothes>[] = [
  {
    accessorKey: "room_no",
    header: "Room",
    cell: ({ row }) => {
      return <div className="font-semibold">{row.original.room_no}</div>;
    },
  },
  {
    accessorKey: "total_quantity",
    header: "Total",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.total_quantity}</div>;
    },
  },
  {
    accessorKey: "plant_confirmed_time",
    header: "Confirmed",
    cell: ({ row }) => {
      const date = row.original.plant_confirmed_time;

      return (
        <div className="font-medium">
          {date ? format(date, "EEEE, MMM dd") : "Not Confirmed"}
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
          placedOn={row.original.confirmed_time!}
        />
      );
    },
  },
];
