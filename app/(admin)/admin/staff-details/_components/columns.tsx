"use client";

import { Staff } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "group",
    header: "Group",
  },
  {
    id: "id",
    cell: ({ row }) => {
      return <CellAction itemId={row.original.id} />;
    },
  },
];
