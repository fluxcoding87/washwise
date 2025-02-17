import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CellAction } from "./cell-action";
import { Laundry, MissingItem } from "@prisma/client";
import { Name } from "./name";

export const columns: ColumnDef<MissingItem & { laundry: Laundry }>[] = [
  {
    accessorKey: "laundry_room_no",
    header: "Room No",
    cell: ({ row }) => {
      return (
        <span className="font-semibold">{row.original.laundry.room_no}</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Missing Since",
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {format(row.original.createdAt, "dd MMM, EEEE")}
        </span>
      );
    },
  },
  {
    accessorKey: "clothingItemId",
    header: "Item Name",
    cell: ({ row }) => {
      return <Name clothingItemId={row.original.clothingItemId} />;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.quantity}</span>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {row.original.status ? "Resolved" : "Not Resolved"}
        </span>
      );
    },
  },
  {
    id: "id",
    cell: ({ row }) => {
      return <CellAction itemId={row.original.id} />;
    },
  },
];
