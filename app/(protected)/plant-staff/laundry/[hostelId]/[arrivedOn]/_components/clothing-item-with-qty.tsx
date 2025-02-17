import { itemIconMap } from "@/app/(protected)/student/new-order/_components/order-page-client";
import { IndividualClothesTotal } from "./client";
import { GiShirt } from "react-icons/gi";

interface ClothingItemWithQtyProps {
  item: IndividualClothesTotal;
}

export const ClothingItemWithQty = ({ item }: ClothingItemWithQtyProps) => {
  const Icon =
    itemIconMap.find((val) => item.name === val.name)?.icon ?? GiShirt;

  return (
    <div
      key={item.clothingItemId}
      className="flex items-center justify-between rounded-lg group hover:-translate-y-2 transition duration-200 shadow-lg cursor-pointer"
    >
      <div className="flex items-center gap-x-2 md:gap-x-4 p-4 flex-1 border border-primary border-r-0 rounded-l-lg">
        <Icon className="size-5 md:size-6 text-sky-700" />
        <div className="font-semibold text-base text-neutral-800 ">
          {item.name}
        </div>
      </div>
      <div className="flex font-bold text-lg items-center justify-center bg-primary text-white h-[100%] w-[25%] rounded-r-lg border border-primary">
        {item.total_qty}
      </div>
    </div>
  );
};
