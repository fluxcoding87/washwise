import { FullClothingItems } from "@/types/clothing";

import { ColumnDef } from "@tanstack/react-table";

import { ItemNameCell } from "./item-name-cell";

export const columns: ColumnDef<FullClothingItems>[] = [
  {
    accessorKey: "clothingItemId",
    header: "Item Name",
    cell: ({ row }) => {
      return <ItemNameCell clothingItemId={row.getValue("clothingItemId")} />;
    },
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => {
      return (
        <div className="font-semibold text-sm md:text-base flex items-center">
          {row.original.quantity}
        </div>
      );
    },
  },
];
