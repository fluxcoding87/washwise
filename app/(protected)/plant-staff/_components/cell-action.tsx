"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface CellActionProps {
  id: string;
  date: Date;
}

export const CellAction = ({ id, date }: CellActionProps) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer py-3 px-4 hover:bg-neutral-200 transition"
          onClick={() => {
            router.push(
              `/plant-staff/laundry/${id}/${format(date, "yyyy-MM-dd")}`
            );
          }}
        >
          <ExternalLink className="size-4 mr-2" />
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
