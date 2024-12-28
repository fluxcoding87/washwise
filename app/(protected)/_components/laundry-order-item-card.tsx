import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Laundry } from "@prisma/client";
import { format } from "date-fns";
import { CalendarFold, Loader2 } from "lucide-react";
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { FaShippingFast } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { IconType } from "react-icons/lib";
import { MdOutlinePendingActions } from "react-icons/md";
import Lottie from "lottie-react";
import StatusIcon from "./status-icon";
import { toast } from "sonner";
import { useViewItemDetails } from "@/hooks/placed-orders/use-view-item-details";
import { OrderItemModal } from "./order-item-modal";
import { LaundryWithClothes } from "@/types/clothing";
import { useSelectedOrderStore } from "../student/issue/_hooks/use-selected-order-store";
import selectedAnimationData from "@/public/selected.json";
import { useGetIssues } from "../student/issue/_hooks/use-get-issues";
interface LaundryOrderItemCardProps {
  data: LaundryWithClothes;
  type?: "default" | "select";
}

export const LaundryOrderItemCard = ({
  data,
  type = "default",
}: LaundryOrderItemCardProps) => {
  const { add, laundryId, remove } = useSelectedOrderStore();
  const { data: issue, isLoading: isIssueLoading } = useGetIssues(data.id);

  const [status, setStatus] = useState("completed");
  const currentDay = format(new Date(), "EEEE");
  const laundryDay = format(data.createdAt, "EEEE");
  const laundryTime = format(data.createdAt, "h:mm a");
  const { open } = useViewItemDetails();
  useEffect(() => {
    if (
      data.confirmed_time &&
      !data.plant_confirmed_time &&
      !data.student_confirmed_time
    ) {
      setStatus("processing");
    } else if (
      !data.confirmed_time &&
      !data.plant_confirmed_time &&
      !data.student_confirmed_time
    ) {
      setStatus("notConfirmed");
    } else if (
      data.plant_confirmed_time &&
      data.confirmed_time &&
      !data.student_confirmed_time
    ) {
      setStatus("awaitingPickup");
    } else if (
      data.confirmed_time &&
      data.plant_confirmed_time &&
      data.student_confirmed_time
    ) {
      setStatus("completed");
    }
    remove();
  }, [data, remove]);
  // const handleItemCardClick = () => {};
  return (
    <>
      {type === "default" && <OrderItemModal laundry={data} status={status} />}
      <button
        disabled={!!issue?.data && type === "select" && issue.data.length === 1}
        onClick={() => {
          if (type === "default") {
            open(data.id);
          } else if (type === "select") {
            add(data.id);
          }
        }}
        className="rounded-xl focus:scale-110 disabled:opacity-60 block w-full relative border border-primary justify-center shadow-lg hover:-translate-y-2 transition cursor-pointer hover:shadow-2xl"
      >
        {type === "select" && laundryId === data.id && (
          <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-lg rounded-xl border flex items-center justify-center">
            <Lottie
              animationData={selectedAnimationData}
              loop={false}
              className="size-28"
            />
          </div>
        )}
        {isIssueLoading ? (
          <div className="flex items-center justify-center w-full h-40">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="p-4 rounded-xl">
              <div className="flex items-center gap-x-2">
                <CalendarFold className="text-primary size-6" />
                <span className="font-bold text-base tracking-wide">
                  {laundryDay === currentDay ? "Today" : laundryDay},{" "}
                  {laundryTime}
                </span>
              </div>
            </div>
            <Separator className="mb-2" />
            <div className="p-4 flex items-center gap-x-4">
              <GiClothes className="size-4 md:size-6 text-sky-700" />
              <span className="font-semibold text-base">
                {data.total_quantity} Clothes
              </span>
            </div>
            <div
              className={cn(
                "rounded-b-xl bg-red-300",
                status === "processing" && "bg-yellow-200",
                status === "completed" && "bg-green-200",
                status === "awaitingPickup" && "bg-[#B2EBF2]"
              )}
            >
              <StatusIcon status={status} />
            </div>
          </>
        )}
      </button>
    </>
  );
};
