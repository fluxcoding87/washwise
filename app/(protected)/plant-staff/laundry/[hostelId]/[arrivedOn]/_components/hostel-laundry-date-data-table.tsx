/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import CalendarInput from "@/components/ui/date-picker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setRoomLaundries: (value: string) => void;
}

export function DateDataTable<TData, TValue>({
  columns,
  data,
  setRoomLaundries,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center py-4 gap-x-6 gap-y-4">
        <Input
          placeholder="Search by room number..."
          value={(table.getColumn("room_no")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            setRoomLaundries(event.target.value);
            table.getColumn("room_no")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        {/* <CalendarInput
          value={dateFilter}
          onChange={(date) => {
            setDateFilter(date);
            // Update the column filter for "createdAt"
            setColumnFilters((prev) => [
              ...prev.filter((filter) => filter.id !== "plant_confirmed_time"),
              {
                id: "plant_confirmed_time",
                value: date ? format(date, "yyyy-MM-dd") : "",
              },
            ]);
          }}
        /> */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn("font-extrabold text-gray-700")}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "bg-[#FFCDD2]",
                    !!row.getValue("plant_confirmed_time") && "bg-[#C8E6C9]"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
