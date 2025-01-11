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
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { useConfirmMissingItem } from "@/hooks/missing-items/use-confirm-missing-items";
import { useDeleteStaff } from "@/hooks/admin/use-delete-staff";

interface CellActionProps {
  itemId: string;
}

export const CellAction = ({ itemId }: CellActionProps) => {
  const { mutate, isPending } = useDeleteStaff();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will delete the staff and associated data with it."
  );

  const handleResolveItem = async () => {
    const ok = await confirm();
    if (!ok) return;
    else {
      mutate({ staffId: itemId });
    }
  };
  return (
    <>
      <ConfirmationDialog />
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
