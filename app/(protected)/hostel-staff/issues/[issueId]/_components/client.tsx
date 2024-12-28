"use client";

import { CustomCardWithHeader } from "@/components/custom-card-with-header";
import { useGetIssueById } from "../_hooks/use-get-issue-by-id";
import { NotFoundComponent } from "@/components/not-found-component";
import { format } from "date-fns";
import { CheckCheckIcon, HelpCircle } from "lucide-react";
import { MdDescription, MdDetails } from "react-icons/md";
import { BiDetail } from "react-icons/bi";
import { LaundryOrderItemCard } from "@/app/(protected)/_components/laundry-order-item-card";
import { HiStatusOnline } from "react-icons/hi";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirmIssue } from "../_hooks/use-confirm-issue";

interface IssueIdPageClientProps {
  issueId: string;
}

export const IssueIdPageClient = ({ issueId }: IssueIdPageClientProps) => {
  const { data, isLoading } = useGetIssueById(issueId);
  const { mutate, isPending } = useConfirmIssue();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="w-full rounded-md h-[400px] sm:h-[500px] md:h-[600px] bg-neutral-400 animate-pulse" />
    );
  }
  if (!data) {
    return <NotFoundComponent />;
  }
  const handleClick = () => {
    mutate(
      { issueId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["issue_id", issueId] });
          queryClient.invalidateQueries({
            queryKey: ["issues_hostel"],
          });
        },
      }
    );
  };
  return (
    <CustomCardWithHeader
      title={`Issue at Room ${data.laundry.room_no} on ${format(
        data.createdAt,
        "dd, MMM EEEE"
      )}`}
      icon={HelpCircle}
    >
      <div className="w-full flex flex-col justify-center gap-8 px-8">
        <div className="col-span-3">
          <div className="flex items-center gap-x-2">
            <BiDetail className="size-6 text-primary" />
            <span className="font-semibold text-base md:text-lg xl:text-xl">
              Laundry Details
            </span>
          </div>
          <div className="py-4">
            <LaundryOrderItemCard data={data.laundry} />
          </div>
        </div>
      </div>

      <Separator className="my-4" />
      <div className="space-y-6 px-6">
        <div className="flex items-center gap-x-2">
          <HiStatusOnline className="size-6 text-primary" />
          <span className="font-semibold text-base md:text-lg xl:text-xl">
            Status
          </span>
        </div>
        <div
          className={cn(
            "bg-red-400 flex items-center justify-center w-full px-6 py-4 rounded-xl font-semibold text-lg",
            data.resolved && "bg-green-300 text-black"
          )}
        >
          <h3>{data.resolved ? "Issue Resolved" : "Not Confirmed"}</h3>
        </div>
        {/* <button
            className={cn(
              "bg-primary text-white flex items-center justify-center w-fit px-6 py-4 rounded-xl font-semibold text-lg",
              data.resolved && "bg-green-300 text-black"
            )}
          >
            Confirm Status
          </button> */}
      </div>
      <Separator className="my-4" />
      <div className="space-y-4 px-6">
        <div className="flex items-center gap-x-2">
          <MdDescription className="size-6 text-primary" />
          <span className="font-semibold text-base md:text-lg xl:text-xl">
            Issue Description
          </span>
        </div>
        <div className="px-4 py-2 min-h-40 max-h-fit border border-primary rounded-md font-semibold bg-primary/10">
          <p>{data.description}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="px-6 flex items-center justify-center">
        <Button
          disabled={data.resolved || isPending}
          onClick={handleClick}
          className="h-16 font-bold text-lg w-full"
        >
          <CheckCheckIcon />
          {data.resolved ? "Already Confirmed" : "Mark issue as ok"}
        </Button>
      </div>
    </CustomCardWithHeader>
  );
};
