"use client";

import { Staff, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type StaffWithUser = Staff & { user: User };

export const columns: ColumnDef<StaffWithUser>[] = [
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
      return <CellAction data={row.original} />;
    },
  },
];
