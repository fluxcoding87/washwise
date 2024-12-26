import Lottie from "lottie-react";
import completedAnimation from "@/public/success-4503215.json";
import awaitingAnimation from "@/public/fast-delivery.json";
import notConfirmedAnimation from "@/public/close.json";
import processingAnimation from "@/public/delivery-time.json";
import { cn } from "@/lib/utils";
const StatusIcon = ({ status }: { status: string }) => {
  let animationData;

  if (status === "notConfirmed") {
    animationData = notConfirmedAnimation; // Add your own animation
  } else if (status === "processing") {
    animationData = processingAnimation;
  } else if (status === "awaitingPickup") {
    animationData = awaitingAnimation;
  } else if (status === "completed") {
    animationData = completedAnimation;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-x-2 px-2 py-2.5 justify-center",
        status === "completed" && "py-[18.3px] pl-6"
      )}
    >
      <Lottie
        animationData={animationData}
        loop={status === "processing" ? true : false}
        className={cn(
          status !== "completed" ? "size-10" : "size-20 absolute left-[0px]"
        )} // Customize the size here00
      />
      <span className="text-base font-semibold">
        {status === "processing" && "Processing"}
        {status === "awaitingPickup" && "Awaiting Pickup"}
        {status === "notConfirmed" && "Not Confirmed"}
        {status === "completed" && "Pickup Successfull!"}
      </span>
    </div>
  );
};

export default StatusIcon;
