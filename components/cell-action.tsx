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
import { useSession } from "next-auth/react";

interface CellActionProps {
  id: string;
  roomNo: string;
  placedOn: Date;
}

export const CellAction = ({ id, roomNo, placedOn }: CellActionProps) => {
  const { data } = useSession();
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
            router.push(`/hostel-staff/laundry/${id}`);
          }}
        >
          <ExternalLink className="size-4 mr-2" />
          View Details
        </DropdownMenuItem>
        {data?.user.role === "plantStaff" ||
          (data?.user.role === "admin" && (
            <DropdownMenuItem className="text-red-600 hover:text-red-700 py-3 px-4 hover:bg-neutral-200 transition cursor-pointer">
              <Trash className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
