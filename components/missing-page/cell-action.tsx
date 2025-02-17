"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, MoreHorizontal } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { useConfirmMissingItem } from "@/hooks/missing-items/use-confirm-missing-items";

interface CellActionProps {
  itemId: string;
}

export const CellAction = ({ itemId }: CellActionProps) => {
  const { mutate, isPending } = useConfirmMissingItem();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will mark the item status as resolved."
  );

  const handleResolveItem = async () => {
    const ok = await confirm();
    if (!ok) return;
    else {
      mutate({ itemId });
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
            className="cursor-pointer text-primary py-3 px-4 hover:bg-neutral-200 transition"
            onClick={handleResolveItem}
          >
            <CheckCircle2Icon className="size-4 mr-2" />
            Mark As Resolved
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
