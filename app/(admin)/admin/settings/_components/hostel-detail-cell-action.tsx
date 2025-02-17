"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2Icon,
  DeleteIcon,
  Edit2Icon,
  Edit3Icon,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { useConfirmMissingItem } from "@/hooks/missing-items/use-confirm-missing-items";
import { useDeleteStaff } from "@/hooks/admin/use-delete-staff";
import { useDeleteHostel } from "@/hooks/admin/use-delete-hostel";
import { UpdateHostelModal } from "./update-hostel-modal";
import { useUpdateHostelStore } from "@/hooks/admin/use-update-hostel-store";
import { Hostel } from "@prisma/client";

interface CellActionProps {
  data: Hostel;
}

export const HostelDetailCellAction = ({ data }: CellActionProps) => {
  const { mutate, isPending } = useDeleteHostel();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will delete the hostel and associated data with it."
  );
  const { open } = useUpdateHostelStore();
  const handleResolveItem = async () => {
    const ok = await confirm();
    if (!ok) return;
    else {
      mutate({ hostelId: data.id });
    }
  };
  return (
    <>
      <ConfirmationDialog />
      {data && <UpdateHostelModal data={data} />}
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
            disabled={isPending}
            className="cursor-pointer py-3 px-4 hover:bg-neutral-200 transition text-amber-700"
            onClick={() => open(data.id)}
          >
            <Edit2Icon className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            className="cursor-pointer text-red-600 py-3 px-4 hover:bg-neutral-200 transition"
            onClick={handleResolveItem}
          >
            <Trash2Icon className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
