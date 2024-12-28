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
import { MdOutlineReportProblem } from "react-icons/md";
import { useMissingItems } from "@/hooks/plant-staff/use-missing-item-store";
import { PlantStaffMissingItemModal } from "./plant-staff-missing-item-modal";
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
  const { open } = useMissingItems();
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
  const handleMissing = async () => {};
  return (
    <>
      <DropdownMenu>
        {type === "hostelStaff" && <ConfirmationDialog />}
        {type === "plantStaff" && <PlantStaffMissingItemModal laundryId={id} />}
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
          {type === "plantStaff" && (
            <DropdownMenuItem
              onClick={() => open(id)}
              disabled={type !== "plantStaff"}
              className="text-amber-700 hover:text-amber-800 py-3 px-4 hover:bg-neutral-200 transition cursor-pointer"
            >
              <MdOutlineReportProblem className="size-4 mr-2" />
              Mark Missing Items
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
