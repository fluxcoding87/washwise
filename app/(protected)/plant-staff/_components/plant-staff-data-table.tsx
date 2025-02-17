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
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import PlantStaffCalendarInput from "./plant-staff-calender-input";
import { useGetHostels } from "@/hooks/hostel/use-get-hostels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Hostel } from "@prisma/client";
import Lottie from "lottie-react";

interface DataTableProps<TData, TValue> {
  hostels: Hostel[];
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  handleInput: (value: string) => void;
  setSelectedDate: (value: Date | string) => void;
}

export function PlantStaffDataTable<TData, TValue>({
  hostels,
  isLoading,
  columns,
  data,
  handleInput,
  setSelectedDate,
}: DataTableProps<TData, TValue>) {
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
  useEffect(() => {
    if (dateFilter) {
      setColumnFilters((prev: any) => [
        ...prev.filter((filter: any) => filter.id !== "arrived_on"),
        {
          id: "arrived_on",
          value: format(dateFilter, "yyyy-MM-dd"),
        },
      ]);
    }
  }, [dateFilter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-x-6 gap-y-4 mb-4 md:mb-0">
        <div className="flex-1">
          <Select
            defaultValue="None"
            onValueChange={(value) => {
              if (value === "None") {
                setColumnFilters([]);
              } else {
                setColumnFilters((prev) => [
                  ...prev.filter((filter) => filter.id !== "name"),
                  {
                    id: "name",
                    value: value,
                  },
                ]);
              }
              handleInput(value);
            }}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select a Hostel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None" defaultChecked>
                All Hostels
              </SelectItem>
              {hostels &&
                hostels.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <PlantStaffCalendarInput
            value={dateFilter}
            onChange={(date) => {
              setDateFilter(date);
              // Update the column filter for "createdAt"
              setColumnFilters((prev) => [
                ...prev.filter((filter) => filter.id !== "arrived_on"),
                {
                  id: "arrived_on",
                  value: date ? format(date, "yyyy-MM-dd") : "",
                },
              ]);
              setSorting([{ id: "arrived_on", desc: false }]);
              setSelectedDate(date);
            }}
          />
        </div>
      </div>
      <div className="rounded-md border relative">
        {isLoading ? (
          <div className="w-full h-48 bg-neutral-400 animate-pulse rounded-md"></div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="font-bold bg-neutral-100 text-gray-600"
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
                      "bg-[#FFCDD2] font-semibold",
                      !!row.getValue("plant_confirmed_time") && "bg-[#C8E6C9]"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            whiteSpace: "nowrap", // Prevent text from wrapping to the next line
                            overflow: "hidden", // Hide overflow
                            textOverflow: "ellipsis", // Optional: Add ellipsis if content overflows
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {isLoading ? (
                      ""
                    ) : (
                      <div className="flex flex-col items-center justify-center h-96">
                        <Lottie
                          animationData={noResultsAnimationData}
                          loop={false}
                          className="size-60"
                        />
                        <h3 className="text-lg font-semibold">No results.</h3>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
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
