import { FullClothingItems, LaundryWithClothes } from "@/types/clothing";

import {
  CheckCircle2,
  Package,
  Loader2,
  TrashIcon,
  Divide,
} from "lucide-react";
import { FaCloud, FaCut, FaGraduationCap, FaTshirt } from "react-icons/fa";
import { AiOutlineLayout } from "react-icons/ai";
import {
  GiFeather,
  GiFoldedPaper,
  GiNecklaceDisplay,
  GiRolledCloth,
  GiShirt,
  GiShorts,
  GiWinterGloves,
  GiWinterHat,
} from "react-icons/gi";
import { BiSquare } from "react-icons/bi";
import { WiCloudy } from "react-icons/wi";
import { ColumnDef } from "@tanstack/react-table";
import { itemIconMap } from "@/app/(protected)/student/new-order/_components/order-page-client";
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
