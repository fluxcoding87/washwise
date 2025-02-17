import { LaundryOrderItemCard } from "@/app/(protected)/_components/laundry-order-item-card";
import { LaundryWithClothes } from "@/types/clothing";
import { Loader2 } from "lucide-react";
import noResultsAnimationData from "@/public/no-results.json";
import Lottie from "lottie-react";

interface ItemsProps {
  laundries: LaundryWithClothes[] | null | undefined;
  isLoading: boolean;
  type?: "default" | "select";
}

export const Items = ({
  laundries,
  isLoading,
  type = "default",
}: ItemsProps) => {
  return (
    <>
      {isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : laundries && laundries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <Lottie
            animationData={noResultsAnimationData}
            loop
            className="size-60"
          />
          <h3 className="text-lg font-semibold">No results.</h3>
        </div>
      ) : (
        laundries && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 md:px-4 py-6">
            {laundries.map((item) => (
              <div key={item.id}>
                <LaundryOrderItemCard data={item} type={type} />
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
};
