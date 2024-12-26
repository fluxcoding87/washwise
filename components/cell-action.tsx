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
import qs from "querystring";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteLaundry } from "@/hooks/hostel-staff/use-delete-laundry";
interface CellActionProps {
  id: string;
  roomNo: string;
  placedOn: Date;
  type?: "plantStaff" | "hostelStaff";
  laundryId?: string;
}

export const CellAction = ({
  id,
  roomNo,
  placedOn,
  type = "hostelStaff",
  laundryId,
}: CellActionProps) => {
  const { mutate, isPending } = useDeleteLaundry();
  const router = useRouter();
  const querystring = qs.stringify({
    type,
  });
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will delete the laundry order"
  );
  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    } else {
      mutate({ laundryId });
    }
  };

  return (
    <>
      <DropdownMenu>
        <ConfirmationDialog />
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
              router.push(`/hostel-staff/laundry/${id}?${querystring}`);
            }}
          >
            <ExternalLink className="size-4 mr-2" />
            View Details
          </DropdownMenuItem>
          {type === "hostelStaff" && (
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isPending || type !== "hostelStaff"}
              className="text-red-600 hover:text-red-700 py-3 px-4 hover:bg-neutral-200 transition cursor-pointer"
            >
              <Trash className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
