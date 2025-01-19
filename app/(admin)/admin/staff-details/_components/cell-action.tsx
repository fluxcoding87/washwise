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
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { useConfirmMissingItem } from "@/hooks/missing-items/use-confirm-missing-items";
import { useDeleteStaff } from "@/hooks/admin/use-delete-staff";
import { Staff } from "@prisma/client";
import { EditStaffDetailsModal } from "./edit-staff-details-modal";
import { useUpdateStaffDetailsStore } from "@/hooks/admin/use-update-staff-details-store";
import { StaffWithUser } from "./columns";

interface CellActionProps {
  data: StaffWithUser;
}

export const CellAction = ({ data }: CellActionProps) => {
  const { open } = useUpdateStaffDetailsStore();
  const { mutate, isPending } = useDeleteStaff();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will delete the staff and associated data with it."
  );

  const handleResolveItem = async () => {
    const ok = await confirm();
    if (!ok) return;
    else {
      mutate({ staffId: data.id });
    }
  };
  return (
    <>
      <ConfirmationDialog />
      <EditStaffDetailsModal data={data} />
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
          <DropdownMenuItem
            className="cursor-pointer text-amber-600 py-3 px-4 hover:bg-neutral-200 transition"
            onClick={() => {
              open(data.id);
            }}
          >
            <Edit2Icon className="size-4 mr-2" />
            Update Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
