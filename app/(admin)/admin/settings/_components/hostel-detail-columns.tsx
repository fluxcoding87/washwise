"use client";

import { Hostel } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { HostelDetailCellAction } from "./hostel-detail-cell-action";

export const hostelDetailColumns: ColumnDef<Hostel>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "gender_type",
    header: "Gender Type",
  },
  {
    accessorKey: "total_floors",
    header: "Total Floors",
  },
  {
    accessorKey: "total_rooms",
    header: "Total Rooms",
  },
  {
    id: "id",
    cell: ({ row }) => {
      return <HostelDetailCellAction data={row.original} />;
    },
  },
];
