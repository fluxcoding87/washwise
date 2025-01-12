"use client";

import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { DottedSeparator } from "@/components/dotted-separator";
import { DataTable } from "@/components/ui/data-table";
import { useGetAdminOrg } from "@/hooks/admin/use-get-admin-org";
import { useGetHostels } from "@/hooks/hostel/use-get-hostels";
import {
  Building2Icon,
  Edit2Icon,
  FilePlus2Icon,
  Loader2,
  MessageCircleWarningIcon,
  PlusIcon,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { MdDetails } from "react-icons/md";
import { hostelDetailColumns } from "./hostel-detail-columns";
import { BsExclamation, BsExclamationTriangleFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { useUpdateOrgStore } from "@/hooks/admin/use-update-org-store";
import { OrgUpdateModal } from "./org-update-modal";
import { AddHostelModal } from "./add-hostel-modal";
import { useAddHostelStore } from "@/hooks/admin/use-add-hostel-store";
import { useConfirm } from "@/hooks/use-confirm";

export const AdminSettingsPageClient = () => {
  const { open: openUpdateOrgModal } = useUpdateOrgStore();
  const { open: openAddHostelModal } = useAddHostelStore();
  const { data: hostels, isLoading: isHostelsLoading } = useGetHostels("admin");
  const { data: orgDetails, isLoading: isOrgLoading } = useGetAdminOrg();

  const isLoading = isHostelsLoading || isOrgLoading;
  return (
    <CustomCardWithHeader title="Organization Settings" icon={Settings2Icon}>
      {isLoading ? (
        <div className="w-full h-72 flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div>
          <div className="w-full flex items-center justify-center md:justify-start">
            {orgDetails && !isLoading && (
              <div className="w-full md:w-[50%] flex items-center gap-x-2">
                <OrgUpdateModal name={orgDetails.name} />
                <AddHostelModal />
                <div className="flex items-center justify-center bg-primary rounded-full size-20 font-bold text-white text-2xl">
                  <span>{orgDetails.name.charAt(0).toUpperCase()}</span>
                  <span>
                    {orgDetails.name.split(" ")[1].charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 flex items-center gap-x-4 justify-between ml-1">
                  <span className="text-xl font-bold">{orgDetails.name}</span>
                  <span
                    onClick={() => openUpdateOrgModal()}
                    className="bg-amber-600 text-white p-2 rounded-md hover:bg-amber-700 transition cursor-pointer"
                  >
                    <Edit2Icon className="size-4 font-bold" />
                  </span>
                </div>
              </div>
            )}
          </div>
          <DottedSeparator className="mt-6" />

          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-x-2">
              <Building2Icon className="text-primary" />
              <span className="text-xl font-semibold">Hostels</span>
              <Button
                size="icon"
                className="ml-4 size-8"
                type="button"
                onClick={openAddHostelModal}
              >
                <PlusIcon className="size-5 font-bold" />
              </Button>
            </div>
            <DataTable columns={hostelDetailColumns} data={hostels ?? []} />

            <div className="w-full border-red-600 border rounded-lg bg-red-500/30 p-4 space-y-4">
              <div className="flex items-center gap-x-2">
                <BsExclamationTriangleFill className="text-red-500 size-6" />
                <span className="font-extrabold tracking-wide text-xl">
                  Danger Zone
                </span>
              </div>

              <Button variant={"destructive"} type="button" className="w-full">
                <Trash2Icon />
                Delete Organization
              </Button>
            </div>
          </div>
        </div>
      )}
    </CustomCardWithHeader>
  );
};
