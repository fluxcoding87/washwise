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
import noResultsAnimationData from "@/public/no-results.json";
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
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import PlantStaffCalendarInput from "@/app/(protected)/plant-staff/_components/plant-staff-calender-input";
import Lottie from "lottie-react";
import CalendarInput from "../ui/date-picker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  handleSelectedDate: (value: Date) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  handleSelectedDate,
}: DataTableProps<TData, TValue>) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());
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
      <div className="flex flex-col md:flex-row md:justify-between items-center py-4 gap-x-6 gap-y-4">
        <CalendarInput
          value={dateFilter}
          onChange={(date) => {
            handleSelectedDate(date);
            setDateFilter(date);
            // setColumnFilters((prev) => [
            //   ...prev.filter((filter) => filter.id !== "createdAt"),
            //   {
            //     id: "createdAt",
            //     value: date ?? "",
            //   },
            // ]);
          }}
        />
      </div>
      {isLoading ? (
        <div className="w-full h-48 bg-neutral-400 animate-pulse rounded-md"></div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                      !!row.getValue("status") && "bg-[#C8E6C9]"
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
                    <div className="flex flex-col items-center justify-center h-96">
                      <Lottie
                        animationData={noResultsAnimationData}
                        loop={false}
                        className="size-60"
                      />
                      <h3 className="text-lg font-semibold">No results.</h3>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
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
