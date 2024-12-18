"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { ExternalLink, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface CellActionProps {
  id: string;
}

export const CellAction = ({ id }: CellActionProps) => {
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
          className="cursor-pointer"
          onClick={() => router.push(`/laundry/${id}`)}
        >
          <ExternalLink className="size-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 hover:text-red-700 cursor-pointer">
          <Trash className="size-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
