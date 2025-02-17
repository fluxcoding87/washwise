import { ColumnDef } from "@tanstack/react-table";
import { IssueWithRoom } from "../_hooks/use-get-issues-by-hostel-id";
import { format } from "date-fns";
import { IssueCellAction } from "./issue-cell-action";

export const columns: ColumnDef<IssueWithRoom>[] = [
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
    header: "Created At",
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {format(row.original.createdAt, "dd, MMM EEEE")}
        </span>
      );
    },
  },
  {
    accessorKey: "resolved",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {row.original.resolved ? "Resolved" : "Not Resolved"}
        </span>
      );
    },
  },
  {
    id: "id",
    cell: ({ row }) => {
      return <IssueCellAction issueId={row.original.id} />;
    },
  },
];
