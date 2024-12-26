import Lottie from "lottie-react";
import notConfirmedAnimation from "@/public/washing-machine.json";
export const NotFoundPage = () => {
  return (
    <div className="w-full h-[60dvh] flex flex-col sm:items-center md:items-center justify-center relative">
      <Lottie
        animationData={notConfirmedAnimation}
        loop
        className="absolute -top-8 md:relative"
      />
      <div className="bottom-20 sm:bottom-32 md:mt-0 absolute md:bottom-6 xl:bottom-12 flex flex-col items-center gap-y-2">
        <span className="font-bold text-gray-600 text-lg">
          Your Last Order Was Not Confirmed.
        </span>
        <span className="font-medium text-gray-500 text-sm md:text-base">
          Please confirm last order either by Staff or if the order has arrived
          at the hostel please approve it.
        </span>
      </div>
    </div>
  );
};
