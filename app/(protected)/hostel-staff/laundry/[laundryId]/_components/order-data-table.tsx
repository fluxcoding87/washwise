/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { AiOutlineNumber } from "react-icons/ai";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useGetClothingItems } from "@/hooks/clothing/clothingItems/use-get-clothing-items";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ClothesClothingItem, ClothingItem } from "@prisma/client";
import {
  CheckCircle,
  CheckCircle2,
  CheckIcon,
  PlusIcon,
  SaveIcon,
  Trash2,
} from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useAddItem } from "@/hooks/placed-orders/use-add-item";
import { AddItemModal } from "./add-item-modal";
import { cn } from "@/lib/utils";
import { useUpdateLaundry } from "@/hooks/placed-orders/use-update-laundry";
import { useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalQty: number;
  clothesClothingItems: ClothesClothingItem[];
  id: string;
  confirmedAt: Date | null;
  plant_confirmed_time: Date | null;
}

export const editClothesClothingItemSchema = z.object({
  clothingItems: z
    .object({
      clothingItemId: z.string().min(1, "Required"),
      quantity: z.string().min(1, "Minimum Qty is 1"),
    })
    .array(),
});

export function OrderDataTable<TData, TValue>({
  columns,
  data,
  id,
  totalQty,
  clothesClothingItems,
  confirmedAt,
  plant_confirmed_time,
}: DataTableProps<TData, TValue>) {
  const searchParams = useSearchParams();

  const [type, setType] = useState<string>("hostelStaff");
  const [tableData, setTableData] = useState(data);
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is reversible with reload or reset"
  );
  const [OrderConfirmDialog, confirmOrder] = useConfirm(
    "Are you sure?",
    "This action cannot be undone. Once you verify it will go for processing"
  );
  const { mutate, isPending } = useUpdateLaundry(id);
  const [doubleClickedRow, setDoubleClickedRow] = useState<string | null>(null);
  const [modifiedRows, setModifiedRows] = useState<
    { id: string; value: boolean }[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<
    { id?: string; name: string; clothingItemId?: string }[]
  >([]);
  const [selectedQuantites, setSelectedQuantites] = useState<
    { id: string; qty: string }[]
  >([]);
  const [totalEditedQuantity, setTotalEditedQuantity] = useState(totalQty);
  const { open, close } = useAddItem();

  const { data: actualClothingItems, isLoading: isItemsLoading } =
    useGetClothingItems();
  const form = useForm<z.infer<typeof editClothesClothingItemSchema>>({
    // resolver: zodResolver(editClothesClothingItemSchema),
    defaultValues: {
      clothingItems: clothesClothingItems.map((item) => ({
        clothingItemId: item.clothingItemId,
        quantity: item.quantity.toString(),
      })),
    },
  });
  const { handleSubmit, control } = form;
  const { append, remove } = useFieldArray({
    control,
    name: "clothingItems",
  });
  const [isEditing, setIsEditing] = useState<
    {
      id: string;
      isEditing: boolean;
    }[]
  >([]);
  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      setType(type);
    }
  }, [searchParams]);
  useEffect(() => {
    setSelectedQuantites((prev) => {
      let updatedValue = [...prev];
      updatedValue = clothesClothingItems.map((item, idx) => ({
        id: idx.toString(),
        qty: item.quantity.toString(),
      }));

      return updatedValue;
    });
  }, [clothesClothingItems]);
  useEffect(() => {
    setSelectedItems((prev) => {
      let updatedValue = [...prev];
      updatedValue = clothesClothingItems.map((item, idx) => {
        const name = actualClothingItems?.find(
          (value) => value.id === item.clothingItemId
        )?.name;
        return {
          clothingItemId: item.clothingItemId,
          name: name!,
        };
      });
      return updatedValue;
    });
  }, [actualClothingItems, clothesClothingItems]);
  useEffect(() => {
    setTableData(data);
    setIsEditing((prev) => [
      ...data.map((item, idx) => ({ id: idx.toString(), isEditing: false })),
    ]);
    setModifiedRows((prev) => [
      ...data.map((item, idx) => ({ id: idx.toString(), value: false })),
    ]);
  }, [data]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const totalEditedQtys = selectedQuantites.reduce(
        (acc, curr) => (acc += +curr.qty),
        0
      );
      setTotalEditedQuantity(totalEditedQtys);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [selectedQuantites]);

  if (isItemsLoading) {
    return <div className="w-full h-96 animate-pulse bg-neutral-200" />;
  }

  const handleDoubleClick = (row: Row<TData>) => {
    setDoubleClickedRow(row.id);
    setIsEditing((prev) => {
      const updatedData = [...prev];
      const updatingIndex = prev.findIndex((item) => item.id === row.id);
      if (updatingIndex !== -1) {
        updatedData[updatingIndex] = {
          ...updatedData[updatingIndex],
          isEditing: !updatedData[updatingIndex].isEditing,
        };
      } else {
        updatedData.push({ id: row.id, isEditing: true });
      }
      const finalData = updatedData.map((item) => {
        if (item.id === row.id) {
          return {
            ...item,
          };
        } else {
          return {
            ...item,
            isEditing: false,
          };
        }
      });
      return finalData;
    });
  };
  const handleSelectedItem = (clothingItemId: string, row: Row<TData>) => {
    const name = actualClothingItems?.find(
      (item) => item.id === clothingItemId
    )?.name;
    setSelectedItems((prev) => {
      const latestValues = [...prev];
      const existingItem = latestValues.find(
        (item) => item.clothingItemId === clothingItemId
      );
      let updatedValues: {
        id?: string;
        name: string;
        clothingItemId?: string;
      }[] = [];
      if (!existingItem) {
        updatedValues = latestValues.map((item, idx) => {
          if (idx === +row.id) {
            return {
              ...item,
              name: name!,
              clothingItemId,
            };
          } else {
            return {
              ...item,
            };
          }
        });
      } else {
        return latestValues;
      }
      return updatedValues;
    });
  };
  const handleInputQty = (id: string, inputValue: string) => {
    setSelectedQuantites((prev) => {
      const updatedValue = [...prev];
      const existingItemIndex = updatedValue.findIndex(
        (item) => item.id === id
      );

      if (existingItemIndex !== -1) {
        updatedValue[existingItemIndex].qty = inputValue;
      } else {
        updatedValue.push({ id, qty: inputValue });
      }
      return updatedValue;
    });
  };

  const externalSubmit = () => {
    handleSubmit(onSubmit)();
  };
  const onSubmit = async (
    values: z.infer<typeof editClothesClothingItemSchema>
  ) => {
    const ok = await confirmOrder();
    if (!ok) {
      return;
    }
    mutate(values);
    // console.log(values);
  };
  const updateTableData = (doubleClickedRow: string) => {
    setTableData((prev) => {
      const latestValues = [...prev];
      const finalValues = latestValues.map((item, idx) => {
        if (idx === +doubleClickedRow) {
          return {
            ...item,
            clothingItemId: selectedItems[+doubleClickedRow].clothingItemId,
            quantity: selectedQuantites[+doubleClickedRow].qty,
          };
        } else {
          return {
            ...item,
          };
        }
      });
      return finalValues;
    });
  };
  const handleClick = (row?: Row<TData>) => {
    if (
      (doubleClickedRow && doubleClickedRow !== row?.id) ||
      (!row && doubleClickedRow)
    ) {
      setDoubleClickedRow(null);
      setIsEditing((prev) => [
        ...prev.map((item) => ({ ...item, isEditing: false })),
      ]);
      updateTableData(doubleClickedRow);
      setModifiedRows((prev) => {
        const latestValues = [...prev];
        const existingItemIndex = latestValues.findIndex(
          (item) => item.id === doubleClickedRow
        );
        if (existingItemIndex !== -1) {
          latestValues[existingItemIndex].value = true;
        }
        return latestValues;
      });
    }
  };
  const handleDelete = async (row: Row<TData>) => {
    const ok = await confirm();
    if (!ok) {
      return;
    } else if (selectedItems.length <= 1 && type === "plantStaff") {
      toast.error("Cannot delete only left item!");
    } else {
      if (doubleClickedRow) {
        setDoubleClickedRow(null);
        setIsEditing((prev) => [
          ...prev.map((item) => ({ ...item, isEditing: false })),
        ]);
        setSelectedItems((prev) => {
          const updatedValues = [...prev];
          const finalValues = updatedValues.filter(
            (item) => item.clothingItemId !== row.getValue("clothingItemId")
          );

          return finalValues;
        });
        setSelectedQuantites((prev) => {
          const updatedValues = [...prev];
          const values = updatedValues.filter((item) => item.id !== row.id);
          const finalValues = values.map((item, idx) => {
            return {
              id: idx.toString(),
              qty: item.qty,
            };
          });

          return finalValues;
        });
        setTableData((prev) => {
          const latestValues = [...prev];
          const updatedValues = latestValues.filter(
            (item, idx) => idx !== +row.id
          );

          return updatedValues;
        });
        setModifiedRows((prev) => {
          const latestValues = [...prev];
          const updatedValues = latestValues.filter(
            (item) => item.id !== row.id
          );
          return updatedValues.map((item, idx) => ({
            ...item,
            id: idx.toString(),
          }));
        });
      }
      remove(+row.id);
    }
  };

  const handleAddRow = (clothingItemId: string, qty: string) => {
    if (selectedItems.length >= 1) {
      setTableData((prev) => {
        const latestValues = [...prev];
        const updatedValues = [];

        for (let i = 0; i < selectedItems.length; i++) {
          updatedValues.push({ ...latestValues[i] });
          if (i === selectedItems.length - 1) {
            updatedValues.push({
              ...latestValues[i - 1],
              clothingItemId,
              quantity: +qty,
            });
          }
        }
        return updatedValues;
      });
      setSelectedItems((prev) => {
        const name = actualClothingItems?.find(
          (item) => item.id === clothingItemId
        )?.name;
        const latestValues = [...prev];
        latestValues.push({ clothingItemId, name: name! });
        return latestValues;
      });
      setSelectedQuantites((prev) => {
        const latestValues = [...prev];
        const id = latestValues.length.toString();
        latestValues.push({ id, qty });
        return latestValues;
      });
      setModifiedRows((prev) => {
        const latestValues = [...prev];
        latestValues.push({ id: tableData.length.toString(), value: true });
        return latestValues;
      });
      append({ clothingItemId, quantity: qty });
      close();
    } else {
      close();
      return;
    }
  };
  // console.log(selectedQuantites);

  return (
    <div className="rounded-md">
      <ConfirmationDialog />
      <AddItemModal
        clothingItems={actualClothingItems!}
        selectedItems={selectedItems}
        handleAddRow={handleAddRow}
      />
      <OrderConfirmDialog />
      <Table>
        <TableHeader className="py-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                if (header.id === "quantity") {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-base font-bold flex mt-2 items-center justify-between"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <div>
                        <Button
                          size={"icon"}
                          className="font-extrabold bg-[#E0F7FA]"
                          variant="outline"
                          onClick={open}
                          disabled={
                            isPending ||
                            (!!confirmedAt && type === "hostelStaff") ||
                            (!!plant_confirmed_time && type === "plantStaff") ||
                            selectedItems.length === 0
                          }
                        >
                          <PlusIcon className="font-extrabold text-black" />
                        </Button>
                      </div>
                    </TableHead>
                  );
                }
                return (
                  <TableHead
                    key={header.id}
                    className="text-base font-bold p-0 pb-4 pt-4 pl-4"
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
            <Form {...form}>
              {table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "cursor-pointer",
                    modifiedRows.find((item) => item.id === row.id)?.value &&
                      "bg-[#FFE0B2]",
                    confirmedAt &&
                      type === "hostelStaff" &&
                      "pointer-events-none",
                    plant_confirmed_time &&
                      type === "plantStaff" &&
                      "pointer-events-none"
                  )}
                  onDoubleClick={() => handleDoubleClick(row)}
                  onClick={() => handleClick(row)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const editable = isEditing.find(
                      (item) => item.id === row.id
                    )?.isEditing;
                    if (editable) {
                      if (cell.column.id === "clothingItemId") {
                        return (
                          <TableCell key={cell.id}>
                            <FormField
                              name={`clothingItems.${idx}.clothingItemId`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        handleSelectedItem(value, row);
                                      }}
                                      defaultValue={
                                        selectedItems[idx].clothingItemId ??
                                        undefined
                                      }
                                      value={
                                        selectedItems[idx].clothingItemId ??
                                        undefined
                                      }
                                    >
                                      <SelectTrigger className="w-full font-semibold text-base">
                                        <SelectValue placeholder="Select an item" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {actualClothingItems?.map((item) => {
                                          const existingItem =
                                            selectedItems.find(
                                              (val) =>
                                                val.clothingItemId === item.id
                                            );

                                          return (
                                            <SelectItem
                                              className={`font-semibold text-base ${
                                                existingItem
                                                  ? "text-gray-400"
                                                  : ""
                                              }`}
                                              key={item.id}
                                              value={item.id}
                                              disabled={!!existingItem}
                                            >
                                              {item.name}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        );
                      }
                      if (cell.column.id === "quantity") {
                        return (
                          <TableCell
                            key={cell.id}
                            className="flex items-center justify-between gap-x-2 md:gap-x-4"
                          >
                            <FormField
                              name={`clothingItems.${idx}.quantity`}
                              defaultValue={
                                form.control._defaultValues.clothingItems?.[idx]
                                  ?.quantity
                              }
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className="flex-1 w-[20px]">
                                  <FormControl>
                                    <Input
                                      className="font-semibold text-base"
                                      {...field}
                                      value={selectedQuantites[+row.id].qty}
                                      onChange={(e) => {
                                        let newValue = e.target.value;

                                        newValue = newValue.replace(
                                          /[^0-9]/g,
                                          ""
                                        );

                                        field.onChange(newValue);

                                        handleInputQty(row.id, newValue);
                                      }}
                                      onBlur={(e) => {
                                        let finalValue = e.target.value;

                                        if (
                                          finalValue === "" ||
                                          parseInt(finalValue) < 1
                                        ) {
                                          finalValue = "1";
                                        }

                                        field.onChange(finalValue);

                                        handleInputQty(row.id, finalValue);
                                      }}
                                      type="number"
                                      max={200}
                                      min={1}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              variant="destructive"
                              className="px-2 md:px-4"
                              onClick={() => handleDelete(row)}
                              disabled={isPending}
                            >
                              <Trash2 className="size-4 md:size-5 hover:text-red-500" />
                            </Button>
                          </TableCell>
                        );
                      }
                    } else {
                      return (
                        <TableCell key={cell.id} className="mt-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
            </Form>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow className="bg-neutral-200 font-bold text-base">
            <TableCell className="flex items-center gap-x-2">
              <AiOutlineNumber className="size-5" />
              <span>Total</span>
            </TableCell>
            <TableCell>{totalEditedQuantity}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {(plant_confirmed_time && type === "plantStaff") ||
      (confirmedAt && type === "hostelStaff") ? (
        <div className="mt-4 rounded-md flex items-center justify-center py-6 bg-green-600 text-white font-bold gap-x-2 text-lg">
          <CheckCircle className="size-5" />
          <span>
            {type === "hostelStaff"
              ? "Approved by Hostel Staff"
              : "Approved by Plant Staff"}
          </span>
        </div>
      ) : (
        <div className="py-8 px-2 flex items-center">
          <button
            disabled={isPending}
            onClick={() => {
              if (doubleClickedRow) {
                return handleClick();
              } else {
                return externalSubmit();
              }
            }}
            className={cn(
              "flex w-full mx-auto items-center disabled:opacity-20 disabled:pointer-events-none justify-center gap-x-2 font-semibold text-base hover:opacity-80 transition px-4 py-3 rounded-lg text-white cursor-pointer",
              doubleClickedRow
                ? "bg-[#4CAF50] hover:bg-[#4CAF50]"
                : "bg-sky-700"
            )}
          >
            {doubleClickedRow ? (
              <SaveIcon className="size-5" />
            ) : (
              <CheckCircle2 className="size-5" />
            )}

            <span>{doubleClickedRow ? "Save Changes" : "Confirm Order"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
